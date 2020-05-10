import newToolbar from "views/tango/newToolbar";
import {newRemoveAttributeSettings, toolbar_extension} from "./remove_attribute_toolbar.js";
import {kNonPlottableDataTypes} from "./plot.js";
import {openAttributeWindow} from "./device_controls.js";

/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */

export const PlotlyWidgetController = class extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_mainview_item(newPlotlyWidgetTab({id: 'plotly_widget'}));
    }

    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api) {
        const host = await PlatformContext.rest.fetchHost("localhost:10000");
        const device = await host.fetchDevice("sys/tg_test/1");
        let attr = await device.fetchAttr("double_scalar");


        // $$('plotly_widget').addAttribute(attr);
        //
        // attr = await device.fetchAttr("long_scalar");
        // $$('plotly_widget').addAttribute(attr);
    }
};

//disable Xenv widget for master
// PlotlyWidgetController.initialize();


function newPlotlyContainer() {
    return TangoWebapp.ui.newScalar({
        id: 'plot',
        empty: true
    });
}

/**
 *
 * @param {Array<TangoAttribute>} attrs
 * @return {Map<TangoDevice, TangoAttribute>}
 */
function groupAttributesByDeviceId(attrs) {
    const map = new Map();
    attrs.forEach((item) => {
        const key = item.getDevice();
        const collection = map.get(key);
        if (!collection) {
            map.set(key, [item]);
        } else {
            collection.push(item);
        }
    });
    return map;
}

const plotly_widget = webix.protoUI({
    name: "plotly_widget",
    getInitialState(){
        return {
            hide_settings: false,
            attrs: []
        };
    },
    _ui() {
        return {
            rows: [
                newPlotlyContainer(),
                newRemoveAttributeSettings(),
                newToolbar(toolbar_extension())
            ]
        }
    },
    restoreState(state) {
        webix.promise.all(
            state.data.attrs.map(attrId => PlatformContext.rest.fetchAttr(attrId))).then(attrs => {
            const $$plot = this.$$('plot');
            $$plot.addTraces(
                attrs.map(attr => attr.getDevice().display_name + "/" + attr.info.label),
                attrs.map(attr => []), attrs.map(attr => []));
            attrs.forEach(attr => this.$$('settings').addAttribute(attr.id));
            this.run();
        });

        if(state.data.hide_settings)
            this.hideSettings();
    },
    _add_scalar(scalar) {
        scalar.read().then(() => {
            const $$plot = this.$$('plot');
            $$plot.addTrace(scalar.getDevice().display_name + "/" + scalar.info.label, [scalar.timestamp], [scalar.value], this.state.data.attrs.indexOf(scalar.id));
        });
    },
    _add_new_scalar(scalar) {
        if (kNonPlottableDataTypes.includes(scalar.info.data_type)) {
            webix.message(`Can not plot attr[${scalar.name}] of type ${scalar.info.data_type}`);
            return;
        }
        this.state.data.attrs.push(scalar.id);
        this.state.updateState();
        this._add_scalar(scalar);
        this.$$('settings').addAttribute(scalar.id);
    },
    _plotly_legendclick(ndx) {
        const attrId = this.state.data.attrs[ndx];
        const attr = TangoAttribute.find_one(attrId);

        PlatformContext.devices.setCursor(attr.device_id);

        OpenAjax.hub.publish("tango_webapp.item_selected", {
            data: {
                id: attrId,
                kind: 'attrs'
            }
        });

    },
    /**
     *
     * @param {TangoAttribute} attr
     */
    addAttribute(attr) {
        if (attr.isScalar()) {
            if (this.state.data.attrs.indexOf(attr.id) < 0)
                this._add_new_scalar(attr);
            else
                this.run();
        } else {
            openAttributeWindow(attr);
        }
    },
    removeAttribute(id) {
        const index = this.state.data.attrs.indexOf(id);
        webix.assert(index > -1, `assertion error: attr[${id}] is not found in this widget`);

        this.$$('plot').deleteTrace(index);
        this.$$('settings').removeAttribute(id);

        this.state.data.attrs.splice(index, 1);
        this.state.updateState();
    },
    async run() {
        const grouped = groupAttributesByDeviceId(this.state.data.attrs.map(attrId => TangoAttribute.find_one(attrId)));
        let update = await webix.promise.all(
            Array.from(grouped.keys())
                .map(device => device.fetchAttrValues(
                    grouped.get(device).map(attr => attr.name))
                    .then(values => values.map(val => webix.extend(val, {device_id: device.id})))));

        //flat
        update = update.reduce((acc, val) => acc.concat(val), []);

        const traces = [];
        const times = [];
        const values = [];

        update.forEach(update => {
            if (update.quality === 'FAILURE') return;
            const indexOf = this.state.data.attrs.indexOf(`${update.device_id}/${update.name}`);
            traces.push(indexOf);
            times.push(update.timestamp);
            values.push(update.value);
        });
        this.$$('plot').updateTraces(traces, times, values);
    },
    $init(config) {
        webix.extend(config, this._ui());

        this.addDrop(this.getNode(), {
            /**
             * @function
             * @memberof  ui.AttrsMonitorView.attrs_monitor_view
             * @see {@link https://docs.webix.com/api__dragitem_onbeforedrop_event.html| onBeforeDrop}
             */
            $drop: function (source, target) {
                const dnd = webix.DragControl.getContext();
                if (dnd.from.config.$id === 'attrs') {
                    const attr = TangoAttribute.find_one(dnd.source[0]);
                    if (attr == null) return false;

                    this.addAttribute(attr);
                }
                // if(dnd.from.config.view === 'devices_tree_tree'){
                //     this.addDevice(dnd.source[0]);
                // }
                return false;
            }.bind(this)
        });
    },
    defaults: {
        on: {
            onPlotlyLegendClick(ndx) {
                this._plotly_legendclick(ndx);
            }
        }
    }
}, TangoWebappPlatform.mixin.Stateful, TangoWebappPlatform.mixin.ToggleSettings, TangoWebappPlatform.mixin.Runnable, webix.EventSystem, webix.DragControl, webix.IdSpace, webix.ui.layout);

export function newPlotlyWidgetBody(config) {
    return webix.extend({
        view: "plotly_widget"

    }, config);
}

export function newPlotlyWidgetTab(config) {
    return {
        header: "<span class='webix_icon mdi mdi-chart-line'></span> PlotlyWidget",
        borderless: true,
        body: newPlotlyWidgetBody(config)

    };
}

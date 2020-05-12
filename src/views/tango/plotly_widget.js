import "./scalar_view";
import newToolbar from "views/tango/newToolbar";
import {newRemoveAttributeSettings, toolbar_extension} from "./remove_attribute_toolbar.js";
import {Runnable, ToggleSettings, WaltzWidgetMixin} from "views/mixins";
import {TangoId} from "@waltz-controls/tango-rest-client";
// import {openAttributeWindow} from "./device_controls.js";

const kOverlayDelayTimeout = 3000;

function newPlotlyContainer() {
    return {
        view: 'scalar',
        id: 'plot',
        empty: true
    };
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
    _ui(config) {
        return {
            rows: [
                newPlotlyContainer(),
                newRemoveAttributeSettings(config),
                newToolbar(toolbar_extension())
            ]
        }
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
    showOverlay(msg){
        this.disable();
        // $$datatable.showOverlay(msg);
        webix.message({expire:kOverlayDelayTimeout, text:msg});
        setTimeout(() => {
            this.enable();
            // $$datatable.hideOverlay();
        },kOverlayDelayTimeout);
    },
    $init(config) {
        webix.extend(config, this._ui(config));

        this.addDrop(this.getNode(), {
            /**
             * @function
             * @memberof  ui.AttrsMonitorView.attrs_monitor_view
             * @see {@link https://docs.webix.com/api__dragitem_onbeforedrop_event.html| onBeforeDrop}
             */
            $drop: function (source, target) {
                const context = webix.DragControl.getContext();
                if (context.from.config.view === 'device_tree_list' &&
                    context.from.config.$id === 'attrs') {
                    this.config.root.addAttribute(TangoId.fromMemberId(context.source[0]));
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
}, ToggleSettings, Runnable, WaltzWidgetMixin, webix.EventSystem, webix.DragControl, webix.IdSpace, webix.ui.layout);
import "./scalar_view";
import {newRemoveAttributeSettings, toolbar_extension} from "./remove_attribute_toolbar.js";
import {newToolbar, Runnable, ToggleSettings, WaltzWidgetMixin} from "@waltz-controls/waltz-webix-extensions";
import {TangoId} from "@waltz-controls/tango-rest-client";

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
 * @param {Array<ContextEntity>} attrs
 * @return {Map<TangoDevice, TangoAttribute>}
 */
function groupAttributesByDeviceId(attrs) {
    const map = new Map();
    attrs.forEach((item) => {
        const key = TangoId.fromMemberId(item.id).getTangoDeviceId();
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
    async run() {
        const attrs = this.config.root.attributes.find(() => true);
        const grouped = groupAttributesByDeviceId(attrs);
        const rest = await this.getTangoRest();
        //TODO replace with attributes entry point
        let update = await Promise.all(
            Array.from(grouped.keys())
                .map(deviceId => rest.newTangoDevice(TangoId.fromDeviceId(deviceId)).toTangoRestApiRequest()
                    .attributes('value')
                    .get('?' + grouped.get(deviceId).map(attr => `attr=${attr.info.name}`).join('&'))
                    .toPromise()
                    .then(values => values.map(val => webix.extend(val, {tango_id: TangoId.fromDeviceId(deviceId)})))));

        //flat
        update = update.reduce((acc, val) => acc.concat(val), []);

        const traces = [];
        const times = [];
        const values = [];

        update.forEach(update => {
            if (update.quality === 'FAILURE') return;
            const indexOf = this.config.root.attributes.getIndexById(`${update.tango_id.getTangoDeviceId()}/${update.name}`);
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
                // this._plotly_legendclick(ndx);
            }
        }
    }
}, ToggleSettings, Runnable, WaltzWidgetMixin, webix.EventSystem, webix.DragControl, webix.IdSpace, webix.ui.layout);
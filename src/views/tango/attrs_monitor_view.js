import newToolbar from "views/tango/newToolbar";
import {kNonPlottableDataTypes} from "./plot.js";
import {WriteTangoAttribute} from "models/user_action";
import {Runnable, ToggleSettings, WaltzWidgetMixin} from "views/mixins";
import {TangoId} from "@waltz-controls/tango-rest-client";
import {toolbar_extension} from "./remove_attribute_toolbar";
import {mergeMap} from "rxjs/operators";
import {from} from "rxjs";
import {kActionSelectTangoDevice} from "../../widgets/tango/actions";

const kOverlayDelayTimeout = 3000;

/**
 * @namespace AttrsMonitorView
 * @memberof ui
 */

    webix.editors.attr_value_editor =  webix.extend({
            getValue:function(){
                const value = this.getInputNode(this.node).value;

                //TODO avoid this: define this as an editor if attr is writable when datatable is created
                const attr = TangoAttribute.find_one(this.row);

                if(attr.info.writable.indexOf('WRITE') !== -1)
                    new WriteTangoAttribute({user: PlatformContext.UserContext.user, attribute: attr, value: value}).submit();

                return value;
            }
    }, webix.editors.text);

    /**
     * @function
     * @return {webix.config} form
     * @memberof ui.AttrsMonitorView
     */
     function newScalarSettings (config){
        return {
            id: 'settings',
            view: 'form',
            elements: [
                {
                    view:"fieldset",
                    label: "Show/hide columns",
                    body: {
                        cols: newScalarsColumns()
                                .filter(column => !column.hidden)
                                .map(column => ({view: "checkbox", label: column.label ? column.label : column.header, labelPosition: "top", name: column.id}))
                    }
                },
                {
                    cols: [
                        {},
                        {
                            view: "button", value: "Apply", maxWidth: 120, click: function () {
                                const $$frm = this.getFormView();
                                config.root.applySettings($$frm.getValues());
                            }
                        }
                    ]
                }
            ]
        }
    };

    function newScalarsColumns() {
        return [
            {
                id: 'id',
                // header: ["Device", {content: "textFilter"}], //TODO custom filter https://docs.webix.com/datatable__headers_footers.html#customheaderandfootercontent
                hidden: true
            },
            {
                id: 'device',
                // header: ["Device", {content: "textFilter"}], //TODO custom filter https://docs.webix.com/datatable__headers_footers.html#customheaderandfootercontent
                header: "Device",
                width: 250,
                sort: "string", fillspace: true
            },
            {
                id: "name",
                header: ["Attribute", {content: "textFilter"}],
                width: 250,
                sort: "string", fillspace: true,
                label: "Attribute"
            },
            {
                id: "value", header: "Value", editor: "inline-text", fillspace: true, template(obj) {
                    return `<input type='text' value='${obj.value}' style="width: 100%">`;
                }
            },
            {id: "value_w", hidden: true},
            {
                id: "save",
                tooltip: "Save all",
                header: '',
                label: '<span class="webix_icon wxi-check"></span>',
                template: '<span class="save webix_icon wxi-check"></span>'
            },
            {id: "quality", header: "Quality", width: 180, sort: "string"},
            {
                id: "timestamp", header: "Last updated", width: 180, fillspace: true, template: function (obj) {
                    return new Date(obj.timestamp);
                }
            },
            {id: "unit", header: "Unit", width: 60, template(obj) {
                    return obj.info.unit;
                }},
            {id: "description", header: "Description", fillspace: true, template(obj) {
                    return obj.info.description;
                }},
            {id: "data_type", hidden: true, template(obj) {
                    return obj.info.data_type;
                }},
            {
                id: "remove", header: "<span class='remove-all webix_icon wxi-trash'></span>",
                tooltip: "Remove all",
                template: function (obj) {
                    return "<span class='remove webix_icon wxi-trash'></span>";
                }
            }
        ];
    }

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.datatable.html webix.ui.datatable}
     * @property {string} name
     * @memberof ui.AttrsMonitorView
     * @namespace scalars
     */
    const scalars = webix.protoUI(
        /** @lends scalars.prototype */{
        name: 'scalars',
        _config: function () {
            return {
                editable: true,
                drag: true,
                scheme: {
                    value: NaN,
                    quality: 'N/A',
                    timestamp: new Date(NaN),
                    $update: function (item) {
                        if (item.quality === 'FAILURE') item.$css = {"background-color": "red"};
                        else if (item.quality === 'ATTR_ALARM' || item.quality === 'ATTR_INVALID') item.$css = {"background-color": "lightcoral"};
                        else if (item.quality === 'ATTR_WARNING') item.$css = {"background-color": "orange"};
                        else delete item.$css;
                    }
                },
                columns: newScalarsColumns(),
                on: {
                    onHeaderClick(obj){
                        if(obj.column === 'remove'){
                            const top = this.getTopParentView();

                            TangoWebappHelpers.iterate(this, (el) => {
                                top.removeAttribute(el);
                            });
                            return false;
                        }
                        if(obj.column === 'save'){
                            debugger
                            return false;
                        }
                    },
                    onBeforeEditStop(state, editor){
                        this.getItem(editor.row).value_w = state.value;
                    },
                    onItemClick(id) {
                        if (this.getSelectedId().row === id.row)
                            this.callEvent("onAfterSelect", [id]);
                    },
                    /**
                     * Fires {@link event:item_selected}
                     *
                     * @fires "tango_webapp.item_selected"
                     * @param id
                     * @memberof  ui.AttrsMonitorView.scalars
                     */
                    onAfterSelect:function(id){
                        this.config.root.dispatch(TangoId.fromMemberId(id.row),kActionSelectTangoDevice);
                    },
                    onBeforeDrop(context) {
                        if (context.from === this) return true;
                        if (context.from.config.view === 'device_tree_list' &&
                            context.from.config.$id === 'attrs') {
                            this.config.root.addAttribute(TangoId.fromMemberId(context.source[0]));
                        }
                        return false;
                    }
                }
            }
        },
        applySettings(values){
            const showColumns = Object.entries(values)
                .filter((element) => element[1]);
            const hideColumns = Object.entries(values)
                .filter((element) => !element[1]);

            hideColumns.forEach((checkbox)=>{
                if(this.isColumnVisible(checkbox[0]))
                    this.hideColumn(checkbox[0]);
            });

            showColumns.forEach((checkbox)=>{
                if(!this.isColumnVisible(checkbox[0]))
                    this.showColumn(checkbox[0]);
            });
        },
         /**
          * @memberof  ui.AttrsMonitorView.scalars
          * @constructor
          */
        $init: function (config) {
            webix.extend(config, this._config());
            this.$ready.push(() => {
                this.data.sync(config.root.attributes);
            });
        },
        defaults: {
            select: true,
            resizeColumn: true
        }
    }, WaltzWidgetMixin, webix.EventSystem, webix.ui.datatable);
    
    /**
     * @memberof ui.AttrsMonitorView
     */
    function newScalars(config){
        return {
            view: 'scalars',
            id: 'scalars',
            root: config.root,
            onClick: {
                "chart": function (event, id) {
                    var attrId = id.row;
                    var item = this.getItem(attrId);
                    // this.getTopParentView().addTab(tabId, attrId, item);
                    if(kNonPlottableDataTypes.includes(item.data_type)) return false;
                    if(item.plotted){
                        this.getTopParentView().stopPlot(item);
                    } else {
                        this.getTopParentView().startPlot(item);
                    }

                    return false;
                },
                "remove":function(event, id){
                    this.config.root.removeAttribute(TangoId.fromMemberId(id.row));

                    return false;
                },
                "save":function(event, id){
                    this.editStop();
                    this.config.root.writeAttribute(TangoId.fromMemberId(id.row), this.getItem(id.row).value_w);
                    return false;
                }
            }
        };
    }

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {string} name
     * @memberof ui.AttrsMonitorView
     * @namespace attrs_monitor
     */
    const attrs_monitor = webix.protoUI(
        /** @lends  attrs_monitor_view.prototype */
        {
        name: 'attrs_monitor',

        /**
        * @memberof ui.AttrsMonitorView.attrs_monitor_view
        */
        async run() {
            const rest = await this.getTangoRest();

            const attrs = this.$$('scalars').find(() => true);

            rest.toTangoRestApiRequest()
                .attributes()
                .value()
                .get(`?${attrs.map(attr => "wildcard=" + attr.id).join('&')}`)
                .pipe(
                    mergeMap(resp => from(resp))
                )
                .subscribe(resp => {
                    const {value, timestamp, quality} = resp;
                    this.$$('scalars').updateItem(`${resp.host}/${resp.device}/${resp.name}`, {value, timestamp, quality})
                })
        },
        _ui: function (config) {
            return {
                rows: [
                    newScalars(config),
                    newScalarSettings(config),
                    newToolbar(
                        toolbar_extension()
                    )
                ]
            }
        },
        showOverlay(msg){
                this.disable();
                webix.message({expire:kOverlayDelayTimeout, text:msg});
                setTimeout(() => {
                    this.enable();
                },kOverlayDelayTimeout);
            },
        /**
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         * @constructor
         */
        $init: function (config) {
            webix.extend(config, this._ui(config));

            this.$ready.push(async () => {
                const userContext = await this.getUserContext()
                const settings = userContext.get(config.id).hideColumns;
                this.$$('settings').setValues(settings);
                this.$$('scalars').applySettings(settings);
            });
        }
        },
        Runnable, WaltzWidgetMixin, ToggleSettings,
        webix.EventSystem, webix.IdSpace, webix.ui.layout);


import newToolbar from "./attrs_monitor_toolbar.js"
import {kNonPlottableDataTypes} from "./plot.js";
import {WriteTangoAttribute} from "../../models/tango_webapp/user_action.js";

/**
 * @namespace AttrsMonitorView
 * @memberof ui
 */
(function () {
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
    const newScalarSettings = function(){
        return {
            id: 'scalar-settings',
            view: 'form',
            hidden: true,
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
                                const $$scalars = $$frm.getTopParentView().$$('scalars');
                                $$scalars.applySettings($$frm.getValues());
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
                id: 'device_id',
                // header: ["Device", {content: "textFilter"}], //TODO custom filter https://docs.webix.com/datatable__headers_footers.html#customheaderandfootercontent
                header: "Device",
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH,
                sort: "string", fillspace: true,
                template: function (obj) {
                    return PlatformContext.devices.getItem(obj.device_id).display_name;
                }
            },
            {
                id: "label",
                header: ["Attribute", {content: "textFilter"}],
                width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH,
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
                    return TangoWebappPlatform.consts.LOG_DATE_FORMATTER(new Date(obj.timestamp));
                }
            },
            {id: "unit", header: "Unit", width: 60},
            {id: "description", header: "Description", fillspace: true},
            {id: "data_type", hidden: true},
            {
                id: "stream", header: "", template: function (obj) {
                    if (kNonPlottableDataTypes.includes(obj.data_type)) return "<span class='webix_icon" +
                        " mdi mdi-cancel'></span>";
                    if (obj.plotted)
                        return "<span class='chart webix_icon mdi mdi-close-circle'></span>";
                    else
                        return "<span class='chart webix_icon mdi mdi-chart-line'></span>";
                },
                label: "Plot"
            },
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
     * @function
     * @return {webix.config}
     * @memberof ui.AttrsMonitorView
     */
    var newScalarsPlot = function(){
        return TangoWebapp.ui.newScalar({
                id: 'plot',
                empty: true
            });
    };
    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.datatable.html webix.ui.datatable}
     * @property {string} name
     * @memberof ui.AttrsMonitorView
     * @namespace scalars
     */
    var scalars = webix.protoUI(
        /** @lends scalars.prototype */
        {
            getInitialState(){
                return {
                    device_id: 1,
                    label: 1,
                    value: 1,
                    save: 1,
                    stream: 1,
                    quality: 0,
                    timestamp: 0,
                    unit: 0,
                    description: 0,
                    remove: 1
                };
            },
        name: 'scalars',
        _config: function () {
            return {
                editable: true,
                drag: true,
                scheme: {
                    value: NaN,
                    quality: 'N/A',
                    timestamp: new Date(NaN),
                    plotted: false,
                    plotIndex: undefined,
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
                        const item = this.getItem(id.row);

                        PlatformContext.devices.setCursor(item.device_id);

                        OpenAjax.hub.publish("tango_webapp.item_selected", {
                            data: {
                                id: item.id,
                                kind: 'attrs'
                            }
                        });
                    },
                    onBeforeDrop(context) {
                        if (context.from === this) return true;
                        if (context.from.config.$id === 'attrs') {
                            const attr = TangoAttribute.find_one(context.source[0]);
                            if (attr != null) {
                                this.getTopParentView().addAttribute(attr);
                            }
                        }
                        return false;
                    }
                }
            }
        },
        /**
         * @param {TangoAttribute} attr
         * @memberof ui.AttrsMonitorView.scalars
         */
        addAttribute: function (attr) {
            webix.assert(attr.info.data_format === 'SCALAR', "data_format must be SCALAR!");

            this.add({
                id: attr.id,
                device_id: attr.device_id,
                label: attr.info.label,
                unit: attr.info.unit,
                description: attr.info.description,
                data_type: attr.info.data_type
            });

            this.hideOverlay();
        },
        /**
         * @param attrs
         * @memberof  ui.AttrsMonitorView.scalars
         */
        update: function (attrs) {
            this.parse(attrs);
        },
        restoreState(state){
            this.applySettings(state.data);
            //TODO the following is undefined - is it possible to make it defined?
            // this.getTopParentView().$$('scalar-settings').setValues(state.data);
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

            if(this.state !== null) this.state.updateState(values);
        },
         /**
          * @memberof  ui.AttrsMonitorView.scalars
          * @constructor
          */
        $init: function (config) {
            webix.extend(config, this._config());
            this.$ready.push(function () {
                this.showOverlay("No data...");
            }.bind(this));
        },
        defaults: {
            select: true,
            resizeColumn: true
        }
    }, TangoWebappPlatform.mixin.Stateful, webix.EventSystem, webix.OverlayBox, webix.ui.datatable);
    
    /**
     * @memberof ui.AttrsMonitorView
     */
    var newScalars = function(){
        return {
            view: 'scalars',
            id: 'scalars',
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
                    this.getTopParentView().removeItem(id.row);

                    return false;
                },
                "save":function(event, id){
                    this.editStop();
                    this.getTopParentView().writeAttribute(id.row, this.getItem(id.row).value_w);
                    return false;
                }
            }
        };
    };
    /**
     * @memberof ui.AttrsMonitorView
     */
    var newAttributes = function(){
        return {
            view: 'tabview',
            gravity: 2,
            id: 'attributes',
            cells: [
                {
                    header: "Scalars",
                    body: newScalars()
                },
                {
                    header: "Plot",
                    body: newScalarsPlot(),
                },
            ]
        }
    };

    function newToolbarSettings() {
        return {
            view: "icon",
            icon: "mdi mdi-settings",
            align: 'left',
            tooltip: "Show/hide scalar settings",
            click: function () {
                const $$scalarSettings = this.getTopParentView().$$('scalar-settings');
                $$scalarSettings.setValues(this.getTopParentView().$$('scalars').state.data);
                if ($$scalarSettings.isVisible())
                    $$scalarSettings.hide();
                else
                    $$scalarSettings.show();
            }
        }
    }

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {string} name
     * @memberof ui.AttrsMonitorView
     * @namespace attrs_monitor
     */
    var attrs_monitor = webix.protoUI(
        /** @lends  attrs_monitor_view.prototype */
        {
        name: 'attrs_monitor',
        _monitored: null,
        _plotted: null,
        _devices: null,
        _plotIndex: 0, //TODO is this shared?
        _view_id_to_attr_id:Object.create(null),
        _add_attr: function (attr) {
            let body;
            if (attr.info.data_format === 'SPECTRUM') {
                body = TangoWebapp.ui.newSpectrum(attr)
            } else if (attr.info.data_format === 'IMAGE') {
                body = TangoWebapp.ui.newImage(attr)
            } else {
                throw new Error(`Unexpected data_format=${attr.info.data_format}`)
            }

            const id = this.$$('attributes').addView({
                close:true,
                header: attr.info.label,
                body
            });
            this._view_id_to_attr_id[id] = attr.id;
        },
        writeAttribute(id, value){
            const attr = TangoAttribute.find_one(id);

            if(attr.info.writable.includes('WRITE'))
                new WriteTangoAttribute({user: PlatformContext.UserContext.user, attribute: attr, value: value}).submit();
        },
        /**
         * @param id
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        removeItem:function(id){
            this._monitored.remove(id);
            if(this.$$('scalars').exists(id))
                this.$$('scalars').remove(id);
        },
        /**
         * @param {} item
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        startPlot:function(item){
            var $$plot = this.$$('plot');
            var $$scalars = this.$$('scalars');

            $$scalars.updateItem(item.id, {
                plotted: true,
                plotIndex: this._plotIndex++
            });

            var device = PlatformContext.devices.getItem(item.device_id);
            $$plot.addTrace(device.display_name + "/" + item.label, [item.timestamp], [item.value], item.plotIndex);
        },
        /**
         * @param item
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        stopPlot:function(item){
            var $$plot = this.$$('plot');
            var $$scalars = this.$$('scalars');

            var index = item.plotIndex;

            $$plot.deleteTrace(index);

            $$scalars.updateItem(item.id, {
                plotted: false,
                plotIndex: undefined
            });

            //TODO replace plotted with array?
            TangoWebappHelpers.iterate(this._plotted, function(plotted){
                if(plotted.plotIndex >= index) plotted.plotIndex--;
            });

            this._plotIndex--;
        },
        _update_plot:function(){
            if (this._plotted.count() === 0) return;

            var plotted =[];
            TangoWebappHelpers.iterate(this._plotted, function(scalar){
                plotted.push(scalar);
            });
            this.$$('plot').updateTraces(
                plotted.map(function (el) {
                    return el.plotIndex;
                }),
                plotted.map(function (el) {
                    return el.timestamp;
                }),
                plotted.map(function (el) {
                    return el.value;
                })
            );
        },
        /**
         * @param attrs
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        update: function (attrs) {
            attrs.forEach(function (attr) {
                if (attr.info.data_format === 'SCALAR' && this.$$('scalars').exists(attr.id)) {
                    this.$$('scalars').updateItem(attr.id, attr);
                } else if(this.$$(attr.id) !== undefined) {
                    this.$$(attr.id).update(attr);
                }
            }, this);

            this._update_plot();
        },
        /*
         * @return {[]}
         */
        _get_attrs_to_update:function(){
            var result = [];

            const value = this.$$('attributes').getTabbar().getValue();
            if (value === 'scalars') {
                TangoWebappHelpers.iterate(this.$$('scalars').data, function (scalar) {
                    result.push(
                        this._monitored.getItem(scalar.id));
                }.bind(this));
            } else if(value === 'plot') {
                TangoWebappHelpers.iterate(this._plotted, function (plotted) {
                    result.push(
                        this._monitored.getItem(plotted.id));
                }.bind(this));
            } else {
                result.push(
                    this._monitored.getItem(value));
            }
            return result;
        },
        /**
        * @memberof ui.AttrsMonitorView.attrs_monitor_view
        */
        run: function () {
            var attrs_to_update = this._get_attrs_to_update();

            for (var device_id in this._devices) {
                var device = this._devices[device_id];

                var filtered_attrs_to_update = attrs_to_update
                    .filter(function (attr_to_update) {
                        return attr_to_update.device_id === device.id;
                    });
                
                if(filtered_attrs_to_update.length !== 0)
                    device.fetchAttrValues(filtered_attrs_to_update
                        .map(function (attr_to_update) {
                            return attr_to_update.name;
                        })).then(function (filtered_attrs_to_update, resp) {
                            this.update(filtered_attrs_to_update.map(function (filtered_attr_to_update, ndx) {
                                return MVC.Object.extend(filtered_attr_to_update, resp[ndx]);
                            }));
                    }.bind(this, filtered_attrs_to_update.slice()))
                        .fail(function(err){
                            TangoWebappHelpers.error(err);
                        });
            }
        },
        /**
         * @param {[]}  scalars
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        parseScalars:function(scalars){
            this._monitored.parse(scalars);
            this.$$('scalars').parse(scalars.map(function(scalar){
                return {
                    id: scalar.id,
                    device_id: scalar.device_id,
                    label: scalar.info.label,
                    unit: scalar.info.unit,
                    description: scalar.info.description,
                    data_type: scalar.info.data_type
                }
            }));

            this.$$('scalars').hideOverlay();
        },
        /**
         * @param {TangoDevice} device
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        addDevice:function(device){
            this._devices[device.id] = device;
        },
        /**
         * @param {TangoAttribute} attr
         * @return boolean
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        addAttribute: function (attr) {
            if (this._monitored.getItem(attr.id) !== undefined) return false;

            attr = attr.attributes();
            this._monitored.add(attr);

            if (attr.info.data_format !== 'SCALAR') {
                this._add_attr(attr);
            } else {
                this.$$('scalars').addAttribute(attr);
            }

            this.addDevice(PlatformContext.devices.getItem(attr.device_id)); //sync filtered?

            return true;
        },
        /**
         * @param {TangoAttribute} attr
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         */
        removeAttribute:function(attr){
            this.removeItem(attr.id);
        },
        _ui: function () {

            return {
                rows: [
                    newAttributes(),
                    newScalarSettings(),
                    newToolbar(
                        newToolbarSettings()
                    )
                ]
            }
        },
        /**
         * @memberof ui.AttrsMonitorView.attrs_monitor_view
         * @constructor
         */
        $init: function (config) {
            webix.extend(config, this._ui());

            this._devices = Object.create(null);
            this._monitored = new webix.DataCollection();
            this._plotted = new webix.DataCollection();

            this.$ready.push(function () {
                this._plotted.sync(this.$$('scalars').data, function () {
                    this.filter(function (obj) {
                        return obj.plotted;
                    })
                });

                this.$$('attributes').getTabbar().attachEvent("onBeforeTabClose",function(id){
                    const attrId = this._view_id_to_attr_id[id];
                    this.removeItem(attrId);
                }.bind(this));
            }.bind(this));
        }
    },
        TangoWebappPlatform.mixin.Runnable, TangoWebappPlatform.mixin.OpenAjaxListener,
        webix.EventSystem, webix.IdSpace, webix.ui.layout);
    /**
     * @param context
     * @augments TangoWebapp.ui.newAttrsMonitorView
     * @memberof ui.AttrsMonitorView
     */
    TangoWebapp.ui.newAttrsMonitorView = function (context) {
        return webix.extend(context, {
            view: "attrs_monitor"
        });
    };
    /**
    * @class AttrsMonitorState
    * @extends TangoWebappPlatform.WidgetState
    * @memberof ui.AttrsMonitorView
    * @namespace AttrsMonitorState
    */
    var AttrsMonitorState = TangoWebappPlatform.WidgetState.extend(
        /** @lends  AttrsMonitorState */
        {
            /**
             * @memberof ui.AttrsMonitorView.AttrsMonitorState
             * @param attrs
             * @constructor
             */
            init:function(attrs){
                attrs.data = attrs.data || Object.create(null);
                this._super(attrs);
            },
            /**
             * @memberof ui.AttrsMonitorView.AttrsMonitorState
             * @return {Array}
             */
            asIdArray:function(){
                var result = [];
                for(var id in this.data)
                    result.push(id);
                return result;
            },
            /**
             * @memberof ui.AttrsMonitorView.AttrsMonitorState
             * @param id
             * @param plotted
             */
            updateState:function(id, plotted){
                var item = Object.create(null);
                item[id] = plotted;
                this._super(item);
            }
        }
        );

    /**
     * @property {string} name
     * @extends attrs_monitor_view
     * @memberof ui.AttrsMonitorView
     * @namespace stateful_attrs_monitor
     */
    var stateful_attrs_monitor = webix.protoUI(
        /** @lends  stateful_attrs_monitor */
        {
        name:'stateful_attrs_monitor',
        /**
         * @memberof ui.AttrsMonitorView.stateful_attrs_monitor
         * @param {AttrsMonitorState} state atributes' names
         */
        restoreState:function(state){
            var parsedIds = state.asIdArray().map(function(id){
                return TangoAttribute.parseId(id);
            });

            //unique host -> unique devices
            var unique_hosts = Object.create(null);
            parsedIds.forEach(function(id){
                if(unique_hosts[id.host] === undefined)
                    unique_hosts[id.host] = Object.create(null);

                unique_hosts[id.host][id.device] = null;
            });

            var self = this;
            for(var host in unique_hosts)
                for (var device in unique_hosts[host])
                    (function(host, device) {
                        PlatformContext.rest.fetchHost(host)
                            .then(function (host) {
                                return host.fetchDevice(device);
                            })
                            .then(function (device) {
                                return device.fetchAttrs();
                            })
                            .then(function (attrs) {
                                var ids = state.asIdArray();
                                attrs.filter(function (attr) {
                                    return ids.indexOf(attr.id) > -1;
                                }).forEach(function (attr) {
                                    webix.ui.attrs_monitor.prototype.addAttribute.apply(self, arguments);
                                    if(state.data[attr.id])
                                        webix.ui.attrs_monitor.prototype.startPlot.call(self, self.$$('scalars').getItem(attr.id));
                                });
                            })
                            .fail(function(err){
                                TangoWebappHelpers.error(err);
                            })

                    })(host, device);
        },
        /**
         * Overrides attrs_monitor_view.addAttribute by adding state update
         * @memberof ui.AttrsMonitorView.stateful_attrs_monitor
         * @param {TangoAttribute} attr
         */
        addAttribute:function(attr){
            if(webix.ui.attrs_monitor.prototype.addAttribute.apply(this, arguments)) {
                this.state.updateState(attr.id, false);
            }
        },
        /**
         * @memberof ui.AttrsMonitorView.stateful_attrs_monitor
         * @param id
         */
        removeItem:function (id) {
            webix.ui.attrs_monitor.prototype.removeItem.apply(this, arguments);
            var state = this.state.getState();
            delete state[id];
            this.state.setState(state);
        },
        /**
         * @memberof ui.AttrsMonitorView.stateful_attrs_monitor
         * @param item
         */
        startPlot:function(item){
            webix.ui.attrs_monitor.prototype.startPlot.apply(this, arguments);
            this.state.updateState(item.id, true);
        },
        /**
         * @memberof ui.AttrsMonitorView.stateful_attrs_monitor
         * @param item
         */
        stopPlot:function(item){
            webix.ui.attrs_monitor.prototype.stopPlot.apply(this, arguments);
            this.state.updateState(item.id, false);
        }
    },TangoWebappPlatform.mixin.Stateful, attrs_monitor);

    /**
     * @param config
     * @memberof ui.AttrsMonitorView
     */
    TangoWebapp.ui.newStatefulAttrsMonitorView = function (config) {
        return webix.extend(config, {
            view: "stateful_attrs_monitor",
            state_class: AttrsMonitorState
        });
    }
})();

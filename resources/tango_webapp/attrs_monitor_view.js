/**
 * @module AttrsMonitorView
 */
(function () {
    /**
     *
     * @return {} toolbar
     */
    newToolbar = function(){
        return {
            view: "toolbar",
            height: 40,
            cols: [
                {view: "counter", id: "refresh", step: 100, value: 1000, min: 100, max: 100000, width: 90},
                {
                    view: "button",
                    type: "iconButton",
                    icon: "refresh",
                    align: 'right',
                    width: 30,
                    click: function () {
                        this.getTopParentView()._delay = this.getTopParentView().$$("refresh").getValue();
                        if (this.getTopParentView().isRunning()) {
                            this.getTopParentView().stop();
                            this.getTopParentView().start();
                        }
                    }
                },
                {
                    view: "toggle",
                    id: "startStop",
                    type: "iconButton",
                    offIcon: "play",
                    onIcon: "pause",
                    align: 'right',
                    width: 30,
                    click: function () {
                        if (this.getValue()) {
                            this.getTopParentView().stop();
                        } else {
                            this.getTopParentView().start();
                        }
                    }
                },
                {}
            ]
        };
    };

    newScalarsPlot = function(){
        return {
            view: 'fieldset',
            label: "Scalar plot",
            body: TangoWebapp.ui.newScalarView({
                id: 'plot',
                empty: true
            })
        }
    };


    /**
     * @type {webix.protoUI}
     */
    var scalars = webix.protoUI({
        name: 'scalars',
        _config: function () {
            return {
                scheme: {
                    value: NaN,
                    quality: 'N/A',
                    timestamp: new Date(NaN),
                    plotted: false,
                    $update: function (item) {
                        if (item.quality === 'FAILURE') item.$css = {"background-color": "red"};
                        else if (item.quality === 'ATTR_ALARM' || item.quality === 'ATTR_INVALID') item.$css = {"background-color": "lightcoral"};
                        else if (item.quality === 'ATTR_WARNING') item.$css = {"background-color": "orange"};
                        else delete item.$css;
                    }
                },
                columns: [
                    {
                        id: 'device_id',
                        // header: ["Device", {content: "textFilter"}], //TODO custom filter https://docs.webix.com/datatable__headers_footers.html#customheaderandfootercontent
                        header: "Device",
                        width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH,
                        sort: "string",
                        template:function(obj){
                            return PlatformContext.devices.getItem(obj.device_id).display_name;
                        }
                    },
                    {
                        id: "label",
                        header: ["Attribute", {content: "textFilter"}],
                        width: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH,
                        sort: "string"
                    },
                    {id: "value", header: "Value", width: 200},
                    {
                        id: "stream", header: "", width: 30, template: function (obj) {
                            if (obj.plotted)
                                return "<span class='chart webix_icon fa-times-circle-o'></span>";
                            else
                                return "<span class='chart webix_icon fa-line-chart'></span>";
                        }
                    },
                    {id: "quality", header: "Quality", width: 180, sort: "string"},
                    {
                        id: "timestamp", header: "Last updated", width: 180, template: function (obj) {
                            return TangoWebappPlatform.consts.LOG_DATE_FORMATTER(new Date(obj.timestamp));
                        }
                    },
                    {id: "unit", header: "Unit", width: 60},
                    {id: "description", header: "Description", fillspace: true}
                ]
            }
        },
        /**
         * @param {TangoAttribute} attr
         */
        addAttribute: function (attr) {
            webix.assert(attr.info.data_format === 'SCALAR', "data_format must be SCALAR!");

            this.add({
                id: attr.id,
                device_id: attr.device_id,
                label: attr.info.label,
                unit: attr.info.unit,
                description: attr.info.description
            });

            this.hideOverlay();
        },
        /**
         * @param
         */
        update: function (attrs) {
            this.parse(attrs);
        },
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
    }, webix.EventSystem, webix.OverlayBox, webix.ui.datatable);

    newScalars = function(){
        return {
            view: 'scalars',
            id: 'scalars',
            onClick: {
                "chart": function (event, id) {
                    var attrId = id.row;
                    var item = this.getItem(attrId);
                    // this.getTopParentView().addTab(tabId, attrId, item);
                    if(item.plotted){
                        this.getTopParentView().stopPlot(item);
                    } else {
                        this.getTopParentView().startPlot(item);
                    }

                    return false;
                }
            }
        };
    };

    newAttributes = function(){
        return {
            view: 'tabview',
            gravity: 2,
            id: 'attributes',
            cells: [
                {
                    header: "Scalars",
                    body: newScalars()
                }
            ]
        }
    };

    /**
     * @type {webix.protoUI}
     */
    var attrs_monitor_view = webix.protoUI({
        name: 'attrs_monitor',
        _monitored: null,
        _plotted: null,
        _devices: null,
        _add_attr: function (attr) {
            if (attr.info.data_format === 'SPECTRUM') {
                this.$$('attributes').addView({
                    header: attr.info.label,
                    body: TangoWebapp.ui.newSpectrumView(attr)
                });
            } else if (attr.info.data_format === 'IMAGE') {
                this.$$('attributes').addView({
                    header: attr.info.label,
                    body: TangoWebapp.ui.newImageView(attr)
                });
            }
        },
        /**
         *
         * @param {} item
         */
        startPlot:function(item){
            var $$plot = this.$$('plot');
            var $$scalars = this.$$('scalars');

            $$scalars.updateItem(item.id, {
                plotted: true
            });

            $$plot.addTrace(item.label, [item.timestamp], [item.value], this._plotted.getIndexById(item.id));
        },
        /**
         *
         * @param item
         */
        stopPlot:function(item){
            var $$plot = this.$$('plot');
            var $$scalars = this.$$('scalars');

            $$plot.deleteTrace(this._plotted.getIndexById(item.id));

            $$scalars.updateItem(item.id, {
                plotted: false
            });
        },
        /**
         *
         */
        update: function (attrs) {
            attrs.forEach(function (attr) {
                if (this.$$('attributes').getTabbar().getValue() === 'scalars') {
                    this.$$('scalars').updateItem(attr.id, attr);
                } else {
                    this.$$(attr.id).update(attr);
                }
            }, this);

            if (this._plotted.count() === 0) return;

            var plotted =[];
            TangoWebappHelpers.iterate(this._plotted, function(scalar){
                plotted.push(scalar);
            });
            this.$$('plot').updateTraces(
                plotted.map(function (el, ndx) {
                    return ndx;
                }),
                plotted.map(function (el) {
                    return el.timestamp;
                }),
                plotted.map(function (el) {
                    return el.value;
                })
                );
        },
        run: function () {
            var attrs_to_update = [];
            TangoWebappHelpers.iterate(this._plotted, function (plotted) {
                attrs_to_update.push(
                    this._monitored.getItem(plotted.id));
            }.bind(this));

            if (this.$$('attributes').getTabbar().getValue() === 'scalars') {
                TangoWebappHelpers.iterate(this.$$('scalars').data, function (scalar) {
                    if (!scalar.plotted) attrs_to_update.push(this._monitored.getItem(scalar.id));
                }.bind(this));
            } else {
                attrs_to_update.push(
                    this._monitored.getItem(this.$$('attributes').getTabbar().getValue()));
            }

            for (var device_id in this._devices) {
                var device = PlatformContext.devices.getItem(device_id);

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
                    }.bind(this, filtered_attrs_to_update.slice()));
            }
        },
        /**
         *
         * @param {TangoAttribute} attr
         */
        addAttribute: function (attr) {
            if (this._monitored.getItem(attr.id) !== undefined) return;

            attr = attr.attributes();
            this._monitored.add(attr);

            if (attr.info.data_format !== 'SCALAR') {
                this._add_attr(attr);
            } else {
                this.$$('scalars').addAttribute(attr);
            }

            this._devices[attr.device_id] = PlatformContext.devices.getItem(attr.device_id); //sync filtered?
        },
        _ui: function () {
            return {
                rows: [
                    newScalarsPlot(),
                    {
                        view: 'resizer'
                    },
                    newAttributes(),
                    newToolbar()
                ]
            }
        },
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
            }.bind(this));
        }
    },
        TangoWebappPlatform.mixin.Runnable,
        webix.EventSystem, webix.IdSpace,
        webix.ui.layout);

    TangoWebapp.ui.newAttrsMonitorView = function (context) {
        return {
            view: "attrs_monitor",
            id: context.id
        }
    }
})();
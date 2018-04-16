/**
 * @module AttrsMonitorView
 */
(function () {
    /**
     * @type {webix.protoUI}
     */
    var _scalars = webix.protoUI({
        name: 'scalars',
        /**
         * @param {TangoAttribute} attr
         */
        addAttribute:function(attr){
            webix.assert(attr.info.data_format === 'SCALAR', "data_format must be SCALAR!");

            this.add({
                id: attr.id,
                label: attr.info.label,
                unit: attr.info.unit,
                description: attr.info.description
            });

            this.hideOverlay();
        },
        /**
         * @param 
         */
        update:function(attrs){
            this.parse(attrs);
        },
        $init: function (config) {
            // webix.extend(config, this._ui());
            this.$ready.push(function () {
                this.showOverlay("No data...");
            }.bind(this));
        },
        defaults: {
            select: true,
            scheme: {
                value: 'N/A',
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
                    id: "label",
                    header: ["Name", {content: "textFilter"}],
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
    },webix.EventSystem, webix.OverlayBox, webix.ui.datatable);

    /**
     * @type {webix.protoUI}
     */
    var attrs_monitor_view = webix.protoUI({
        name: 'attrs_monitor',
        _monitored: null,
        _plotted: null,
        _devices: null,
        _add_attr:function(attr){
            if(attr.info.data_format === 'SPECTRUM'){
                this.$$('attributes').addView({
                    header: attr.info.label,
                    body: TangoWebapp.ui.newSpectrumView(attr)
                });
            } else if(attr.info.data_format === 'IMAGE'){
                this.$$('attributes').addView({
                    header: attr.info.label,
                    body: TangoWebapp.ui.newImageView(attr)
                });
            }
        },
        /**
         *
         */
        update:function(attrs){
            attrs.forEach(function(attr){
                if(this.$$('attributes').getTabbar().getValue() === 'scalars'){
                    this.$$('scalars').updateItem(attr.id, attr);
                } else {
                    this.$$(attr.id).update(attr);
                }
            }, this);
            //TODO plotted
        },
        run:function(){
            var attrs_to_update = [];
            TangoWebappHelpers.iterate(this._plotted, function(plotted){
                attrs_to_update.push(plotted);
            });

            if(this.$$('attributes').getTabbar().getValue() === 'scalars'){
                TangoWebappHelpers.iterate(this.$$('scalars').data, function(scalar){
                    if(!scalar.plotted) attrs_to_update.push(this._monitored.getItem(scalar.id));
                }.bind(this));
            } else {
                attrs_to_update.push(
                    this._monitored.getItem(this.$$('attributes').getTabbar().getValue()));
            }

            for(var device_id in this._devices){
                var device = PlatformContext.devices.getItem(device_id);

                var filtered_attrs_to_update = attrs_to_update
                    .filter(function (attr_to_update) {
                        return attr_to_update.device_id === device.id;
                    });
                device.fetchAttrValues(filtered_attrs_to_update
                    .map(function (attr_to_update) {
                        return attr_to_update.name;
                    })).then(function(filtered_attrs_to_update, resp){
                        this.update(filtered_attrs_to_update.map(function(filtered_attr_to_update, ndx){
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
            if(this._monitored.getItem(attr.id) !== undefined) return;

            this._monitored.add(attr);

            if(attr.info.data_format !== 'SCALAR'){
                this._add_attr(attr);
            } else {
                this.$$('scalars').addAttribute(attr);
            }

            this._devices[attr.device_id] = null;
        },
        $init:function(){
            this._devices = Object.create(null);
            this._monitored = new webix.DataCollection();
            this._plotted = new webix.DataCollection();

            this.$ready.push(function(){
                this._plotted.sync(this.$$('scalars').data, function(){
                    this.filter(function(obj){
                        return obj.plotted;
                    })
                });
            }.bind(this));
        },
        defaults: {
            rows:[
                {
                    template: 'plot'
                },
                {
                    view: 'resizer'
                },
                {
                    view: 'tabview',
                    gravity: 2,
                    id: 'attributes',
                    cells: [
                        {
                            header: "Scalars",
                            body: {
                                view: 'scalars',
                                id: 'scalars'
                            }
                        }
                    ]
                },
                {
                    view:"toolbar",
                    height: 40,
                    cols:[
                        { view:"counter", id: "refresh", step:100, value:1000, min:100, max:100000, width: 90},
                        { view:"button" , type:"iconButton", icon: "refresh", align: 'right', width: 30, click:function(){
                            this.getTopParentView()._delay = this.getTopParentView().$$("refresh").getValue();
                            if(this.getTopParentView().isRunning()) {
                                this.getTopParentView().stop();
                                this.getTopParentView().start();
                            }
                            }},
                        { view:"toggle", id: "startStop", type:"iconButton", offIcon:"play",  onIcon:"pause", align: 'right', width: 30, click:function(){
                            if(this.getValue()){
                                this.getTopParentView().stop();
                            } else {
                                this.getTopParentView().start();
                            }
                            }},
                        {}
                    ]
                }
            ]
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
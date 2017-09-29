/** @module DevicesTree*/
(function () {
    /**
     *
     * @type {{}}
     */
    var tree_context_menu = {
        view: "contextmenu",
        //autoheight: true,
        data: [
            {id: 'open', value: 'Open'},
            {id: 'view', value: 'Monitor'},
            {$template: 'Separator'},
            {id: 'delete', value: 'Delete'}
        ],
        on: {
            onItemClick: function (id) {
                var tree = this.getContext().obj;
                var item = tree.getItem(this.getContext().id);
                var hostId = tree._get_host_id(item);
                var name = tree._get_device_name(item);
                var device_id = hostId + "/" + name;
                OpenAjax.hub.publish("tango_webapp.device_" + id, {data: {id: device_id, host_id: hostId, name: name}});
            }
        }
    };

    /**
     * @type {webix.protoUI}
     */
    var tree = webix.protoUI({
        devices_filter: null,
        name: 'devices_tree_tree',
        /**
         *
         * @param context
         * @private
         */
        _get_data: function (context) {
            var data = {
                id: 'root',
                value: context.rest.url,
                open: true,
                data: []
            };

            TangoWebappHelpers.iterate(context.tango_hosts, function (it) {
                data.data.push({
                    id: it.id,
                    value: it.id,
                    //TODO bind host node data to context.devices
                    webix_kids: it.is_alive,
                    $css: 'tango_host'
                });
            });

            return data;
        },
        /**
         *
         * @param item
         * @private
         */
        _get_host_id: function (item) {
            switch (item.$level) {
                case 5://member
                    (item = this.getItem(item.$parent));
                case 4://family
                    (item = this.getItem(item.$parent));
                case 3://domain
                    return this.getItem(item.$parent).id;
                case 2://tango_host
                    return item.id;
                default:
                    TangoWebapp.debug("_get_host_id called for wrong item: " + item.id);
            }
        },
        /**
         *
         * @param item
         * @private
         */
        _get_device_name: function (item) {
            var member = item.value;
            var family = this.getItem(item.$parent).value;
            var domain = this.getItem(this.getItem(item.$parent).$parent).value;
            return [domain, family, member].join('/');
        },
        /**
         *
         * @param {PlatformContext} context [optional - will use global PlatformContext instead]
         */
        updateRoot: function (context) {
            var context = context || PlatformContext;
            this.clearAll();

            var data = this._get_data(context);

            this.parse([data]);
        },
        $init: function (config) {
            var context = config.context;

            var data = this._get_data(context);
            webix.extend(config, {
                data: [data]
            });

            webix.ui(tree_context_menu).attachTo(this);
        },
        defaults: {
            type: 'lineTree',
            select: true,
            on: {
                onBeforeContextMenu: function (id, e, node) {
                    var item = this.getItem(id);
                    return item.$level == 5;//member
                },
                onItemClick: function (id, e, node) {
                    var item = this.getItem(id);
                    if (!item) return false;//TODO or true

                    var tango_host_id;
                    var tango_host;
                    var device_name;
                    switch (item.$level) {
                        case 2://tango host
                        case 3://domain
                        case 4://family
                            tango_host_id = this._get_host_id(item);
                            PlatformContext.tango_hosts.setCursor(tango_host_id);
                            break;
                        case 5://member
                            tango_host_id = this._get_host_id(item);
                            device_name = this._get_device_name(item);

                            PlatformContext.tango_hosts.setCursor(tango_host_id);

                            tango_host = PlatformContext.tango_hosts.getItem(tango_host_id);
                            tango_host.fetchDevice(device_name).then(function (device) {
                                PlatformContext.devices.setCursor(device.id);
                            });
                            break;
                        default:
                            TangoWebappHelpers.debug("device_tree#clickOnItem " + id);
                    }
                },
                onDataRequest: function (id, cbk, url) {
                    var item = this.getItem(id);

                    var tango_host_id = this._get_host_id(item);
                    var tango_host = PlatformContext.tango_hosts.getItem(tango_host_id);

                    var filter = UserContext.toDeviceFilter();

                    var self = this;
                    switch (item.$level) {
                        case 2://tango_host
                            filter.domain_filter.map(function (it) {
                                return tango_host.fetchDatabase()
                                    .fail(function () {
                                        self.parse({
                                            parent: id,
                                            data: []
                                        });
                                    })
                                    .then(function (db) {
                                        return db.getDeviceDomainList(it)
                                    }).then(function (resp) {
                                        self.parse({
                                            parent: id,
                                            data: resp.output.map(function (el) {
                                                return {value: el, webix_kids: true, $css: 'domain'};
                                            })
                                        });
                                    });
                            });
                            return false;
                        case 3://domain
                            filter.getFamilyFilters(item.value).map(function (it) {
                                return tango_host.fetchDatabase()
                                    .then(function (db) {
                                        return db.getDeviceFamilyList(it);
                                    }).then(function (resp) {
                                        self.parse({
                                            parent: id,
                                            data: resp.output.map(function (el) {
                                                return {value: el, webix_kids: true, $css: 'family'};
                                            })
                                        })
                                    })
                            });
                            return false;
                        case 4://family
                            filter.getMemberFilters(this.getItem(item.$parent).value, item.value).map(function (it) {
                                return tango_host.fetchDatabase()
                                    .then(function (db) {
                                        return db.getDeviceMemberList(it);
                                    }).then(function (resp) {
                                        self.parse({
                                            parent: id,
                                            data: resp.output.map(function (el) {
                                                return {
                                                    $css: 'member',
                                                    value: el
                                                };
                                            })
                                        })
                                    })
                            });
                    }

                    return false;//block further execution
                },
                "user_context.create subscribe": function (event) {
                    var user_context = event.data;
                    event.controller.devices_filter = new DeviceFilter({
                        user: user_context.user,
                        value: user_context.device_filters
                    });
                },
                "user_context.add_tango_host subscribe": function (event) {
                    event.controller.parse({
                        parent: 'root',
                        data: [{
                            id: event.data,
                            value: event.data,
                            $css: 'tango_host',
                            webix_kids: true
                        }
                        ]
                    });
                },
                "user_context.delete_tango_host subscribe": function (event) {
                    event.controller.remove(event.data);
                },
                "platform_context.create subscribe": function (event) {
                    event.controller.updateRoot(event.data);
                },
                "platform_context.set_rest subscribe": function (event) {
                    event.controller.updateRoot(event.data);
                }
            }
        }
    }, TangoWebapp.mixin.OpenAjaxListener, webix.IdSpace, webix.EventSystem, webix.ui.tree);


    var devices_tree = webix.protoUI({
        name: 'devices_tree',
        _ui: function (config) {
            return {
                width: 300,
                rows: [
                    {
                        view: "text",
                        id: "txtFilter",
                        label: "<span class='webix_icon fa-filter' style='padding-left: 10px;'></span>",
                        labelWidth: 32,
                        placeholder: "leave empty to discard",
                        value: "",
                        on: {
                            onTimedKeyPress: function () {
                                $$("devices-tree").filter("#value#", this.getValue());
                            }
                        }
                    },
                    {
                        context: config.context,
                        view: "devices_tree_tree",
                        id: "devices-tree"
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui(config));
        }
    }, webix.ui.layout);

})();
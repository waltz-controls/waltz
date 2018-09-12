/** @module DevicesTree
 *  @memberof ui
 */
(function () {
    /**
     * @constant
     * @memberof ui.DevicesTree
     */
    var kDevicesTreeBackendURL = "/devices-tree/get";

    /**
     * @constant
     * @memberof ui.DevicesTree
     */
    var tree_context_menu = {
        view: "contextmenu",
        id: "devices_tree_context_menu",
        data: [
            {id: 'configure', value: 'Configure'},
            {id: 'view', value: 'Monitor'},
            {$template: 'Separator'},
            {id: 'delete', value: 'Delete'}
        ],
        on: {
            onItemClick: function (id) {
                var tree = this.config.master;
                var item = tree.getItem(this.getContext().id);

                var tango_host = TangoHost.find_one(tree._get_tango_host_id(item));

                tango_host.fetchDevice(item.device_name).then(function (device) {
                    OpenAjax.hub.publish("tango_webapp.device_" + id, {
                        data: {
                            device: device
                        }
                    });
                })
            }
        }
    };

    /**
     * @extends webix.ui.tree
     * @see {@link https://docs.webix.com/api__refs__ui.tree.html webix.ui.tree}
     * @property {String} name
     * @property devices_filter
     * @memberof ui.DevicesTree
     * @namespace tree
     */
    var tree = webix.protoUI(
        /** @lends  tree.prototype */
        {
            devices_filter: null,
            name: 'devices_tree_tree',
            /**
             *
             * @param tango_host
             * @param {TangoHost} tango_host
             * @return {Promise} an array of domains
             * @private
             */
            _expand_tango_host: function (tango_host) {
                var filter = PlatformContext.UserContext.toDeviceFilter();
                return webix.promise.all(filter.getDomainFilters().map(function (it) {
                    return tango_host.fetchDomains(it)
                        .fail(function () {
                            //TODO throw exception/OpenAjax event
                            return [];
                        })
                        .then(function (resp) {
                            return [{value: 'aliases', _value: 'aliases', webix_kids: true, $css: 'aliases'}]
                                .concat(resp.map(function (el) {
                                    return {
                                        value: el.value,
                                        _value: el,
                                        isDomain: true,
                                        webix_kids: true,
                                        $css: 'domain'
                                    };
                                }));
                        });
                })).then(function (filtered_domains) {
                    return Array.prototype.concat.apply([], filtered_domains); //flatten an array of arrays
                });
            },
            /**
             *
             * @param tango_host
             * @param {TangoHost} tango_host
             * @return {Promise} an array of domains
             * @private
             */
            _expand_aliases: function (tango_host) {
                return tango_host.fetchAliases()
                    .then(function (aliases) {
                        return aliases.map(function (it) {
                            return {value: it.value, device_name: undefined, isAlias: true, $css: 'member'};
                        });
                    })
                    .fail(function () {
                        return [];
                    });
            },
            /**
             *
             * @param {TangoHost} tango_host
             * @param {string} domain
             * @return {Promise}
             * @private
             */
            _expand_domain: function (tango_host, domain) {
                var filter = PlatformContext.UserContext.toDeviceFilter();

                return webix.promise.all(filter.getFamilyFilters(domain).map(function (it) {
                    return tango_host.fetchFamilies(it)
                        .then(function (resp) {
                            return resp.map(function (el) {
                                return {value: el.value, webix_kids: true, $css: 'family'};
                            });
                        })
                })).then(function (filtered_families) {
                    return Array.prototype.concat.apply([], filtered_families);//flatten an array of arrays
                }).catch(function () {
                    return [];
                });
            },
            /**
             *
             * @param {TangoHost} tango_host
             * @param {string} domain
             * @param {string} family
             * @return {Promise}
             * @private
             */
            _expand_family: function (tango_host, domain, family) {
                var filter = PlatformContext.UserContext.toDeviceFilter();
                return webix.promise.all(filter.getMemberFilters(domain, family).map(function (it) {
                    return tango_host.fetchMembers(it)
                        .then(function (resp) {
                            return resp.map(function (member) {
                                return {
                                    $css: 'member',
                                    value: member.value,
                                    device_name: [domain, family, member.value].join('/'),
                                    isMember: true
                                }
                            });
                        });
                })).then(function (filtered_members) {
                    return Array.prototype.concat.apply([], filtered_members);//flatten an array of arrays
                }).catch(function () {
                    return [];
                });
            },
            /**
             *
             * @param {PlatformContext} context
             * @private
             */
            _get_data: function (context) {
                return context.UserContext.getTangoHosts().map(function (it) {
                    return {
                        id: it,
                        value: it,
                        webix_kids: true,
                        $css: 'tango_host',
                        data: []
                    };
                });
            },
            /**
             * @memberof ui.DevicesTree.tree.prototype
             * @param {PlatformContext} context [optional - will use global PlatformContext instead]
             */
            updateRoot: function (context) {
                var context = context || PlatformContext;
                this.clearAll();

                this.load(kDevicesTreeBackendURL + "?" +
                context.UserContext.getTangoHosts().map(function (it) {
                    return "v=" + it;
                }).concat(
                    context.UserContext.device_filters.map(function (it) {
                        return "f=" + it;
                    })).join('&'))
                    .fail(function () {
                        this.parse(this._get_data(context));
                    }.bind(this));
            },
            /**
             * @memberof ui.DevicesTree.tree.prototype
             * @constructor
             */
            $init: function (config) {
                var context = config.context;

                // var data = this._get_data(context);
                // webix.extend(config, {
                //     data: [data]
                // });

                webix.ui(tree_context_menu).attachTo(this);
            },
            _get_tango_host_id: function (item) {
                while (item.$css !== 'tango_host') {
                    item = this.getItem(item.$parent)
                }
                return item.id;
            },
            defaults: {
                type: 'lineTree',
                select: true,
                on: {
                    /**
                     * Event listener.
                     * @memberof ui.DevicesTree.tree
                     */
                    onBeforeContextMenu: function (id, e, node) {
                        var item = this.getItem(id);
                        if (item.isAlias || item.isMember) {
                            this.$$("devices_tree_context_menu").config.master = this;
                            this.select(id);
                            return true;
                        }
                        return false;
                    },
                    /**
                     * Event listener.
                     * @memberof ui.DevicesTree.tree
                     */
                    onItemDblClick: function (id) {
                        var item = this.getItem(id);
                        if (!item) return false;//TODO or true

                        if (item.isAlias || item.isMember) {
                            PlatformApi.PlatformUIController().expandDeviceTree();
                        }
                    },
                    /**
                     * Event listener.Happens after click event
                     *
                     * Sets tango host cursor. If alias or member is clicked fetches device.
                     *
                     * @param id
                     * @return {boolean}
                     * @memberof ui.DevicesTree.tree
                     */
                    onAfterSelect: function (id) {
                        var item = this.getItem(id);
                        if (!item) return false;//TODO or true
                        var tango_host = TangoHost.find_one(this._get_tango_host_id(item));
                        PlatformContext.tango_hosts.setCursor(tango_host.id);
                        var promise_device;
                        if ((item.isAlias && item.device_name !== undefined) || item.isMember) {
                            promise_device = tango_host.fetchDevice(item.device_name)
                        }
                        else if (item.isAlias && item.device_name === undefined) {
                            promise_device = tango_host
                                .fetchDatabase()
                                .then(function (db) {
                                    return db.getAliasDevice(item.value);
                                })
                                .then(function (device_name) {
                                    item.device_name = device_name;
                                    return tango_host.fetchDevice(device_name);
                                });
                        } else {
                            return false;
                        }
                        promise_device.then(function (device) {
                                PlatformContext.devices.setCursor(device.id);
                            });
                    },
                    /**
                     * Event listener.
                     * @memberof ui.DevicesTree.tree
                     */
                    onDataRequest: function (id, cbk, url) {
                        this.showProgress({
                            type: "icon"
                        });
                        var item = this.getItem(id);

                        var tango_host = TangoHost.find_one(this._get_tango_host_id(item));

                        var self = this;
                        switch (item.$level) {
                            case 1://tango_host
                                this._expand_tango_host(tango_host).then(function (domains) {
                                    self.parse({
                                        parent: id,
                                        data: domains
                                    });
                                    self.hideProgress();
                                });
                                break;
                            case 2://domain or aliases
                                if (item._value === 'aliases')
                                    this._expand_aliases(tango_host).then(function (aliases) {
                                        self.parse({
                                            parent: id,
                                            data: aliases
                                        });
                                        self.hideProgress();
                                    });
                                else this._expand_domain(tango_host, item.value).then(function (families) {
                                    self.parse({
                                        parent: id,
                                        data: families
                                    });
                                    self.hideProgress();
                                });
                                break;
                            case 3://family
                                this._expand_family(tango_host, this.getItem(item.$parent).value, item.value).then(function (members) {
                                    self.parse({
                                        parent: id,
                                        data: members
                                    });
                                    self.hideProgress();
                                }, function (err) {
                                    self.hideProgress();
                                    debugger
                                });
                                break;
                            default:
                                self.hideProgress();
                        }
                        return false;//block further execution
                    },
                    "user_context_controller.found subscribe": function (event) {
                        var user_context = event.data;
                        this.devices_filter = new DeviceFilter({
                            user: user_context.user,
                            value: user_context.device_filters
                        });
                    },
                    "user_context_controller.add_tango_host subscribe": function (event) {
                        this.load(kDevicesTreeBackendURL + "?v=" + event.data + '&' +
                        PlatformContext.UserContext.device_filters.map(function (it) {
                            return "f=" + it;
                        }).join('&'))
                            .fail(function () {
                                this.parse([{
                                    id: event.data,
                                    value: event.data,
                                    $css: 'tango_host',
                                    webix_kids: true
                                }])
                            }.bind(this))
                    },
                    "user_context_controller.delete_tango_host subscribe": function (event) {
                        this.remove(event.data);
                    },
                    "platform_api.ui.initialized subscribe": function (event) {
                        this.updateRoot(event.data.context);
                    },
                    "platform_context.set_rest subscribe": function (event) {
                        this.updateRoot(event.data);
                    }
                }
            }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.IdSpace, webix.EventSystem, webix.ui.tree);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {String} name
     * @memberof ui.DevicesTree
     * @namespace devices_tree
     */
    var devices_tree = webix.protoUI(
        /** @lends  devices_tree.prototype */
        {
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
                            placeholder: "type to filter",
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
            /**
             * @memberof ui.DevicesTree.devices_tree
             * @constructor
             */
            $init: function (config) {
                webix.extend(config, this._ui(config));
            }
        }, webix.ui.layout);

})();

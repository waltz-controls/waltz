/** @module DevicesTree
 *  @memberof ui
 */
import newSearch from "./search.js";

(function () {
    /**
     * @constant
     * @memberof ui.DevicesTree
     */
    var kDevicesTreeBackendURL = "/tango/rest/rc4/devices/tree";

    /**
     * @constant
     * @memberof ui.DevicesTree
     */
    var tree_context_menu = {
        view: "contextmenu",
        id: "devices_tree_context_menu",
        data: [
            {id: 'configure', value: 'Configure'},
            {id: 'view', value: 'Monitor'}
        ],
        on: {
            /**
             * @event tango_webapp.device_configure
             * @property {{device:TangoDevice}} data
             * @type {OpenAjax}
             * @memberof ui
             */
            /**
             * @event tango_webapp.device_monitor
             * @property {{device:TangoDevice}} data
             * @type {OpenAjax}
             * @memberof ui
             */
            /**
             * @event tango_webapp.device_delete
             * @property {{device:TangoDevice}} data
             * @type {OpenAjax}
             * @memberof ui
             */
            /**
             * Fires {@link #uieventtango_webappdevice_configure event:device_configure}
             *
             * Fires {@link #uieventtango_webappdevice_monitor event:device_monitor}
             *
             * Fires {@link #uieventtango_webappdevice_delete event:device_delete}
             *
             *
             * @fires event:device_configure
             * @fires event:device_monitor
             * @fires event:device_delete
             * @param id
             * @memberof ui.DevicesTree.tree_context_menu
             */
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

                this.load(PlatformContext.rest.url + kDevicesTreeBackendURL + "?" +
                context.UserContext.getTangoHosts().map(function (it) {
                    return "host=" + it;
                }).concat(
                    context.UserContext.device_filters.map(function (it) {
                        return "wildcard=" + it;
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
                type: {
                    folder(obj){
                        switch(obj.$css){
                            case "tango_host":
                                return "<span class='webix_icon mdi mdi-database'> </span>";
                            case "aliases":
                                return `<span class='webix_icon mdi mdi-${obj.$count > 0 ? "link": "crop-square"}'> </span>`;
                            case "tango_domain":
                            case "tango_family":
                                return `<span class='webix_icon mdi mdi-folder${obj.open ? "-open" : ""}'> </span>`;
                            case "member":
                                return "<span class='webix_icon mdi mdi-developer-board'> </span>";
                        }
                        return "";
                    }
                },
                select: true,
                activeTitle:true,
                drag: "source",
                on: {
                    onItemClick(id){
                        this.getItem(id).open = !this.getItem(id).open;
                        if(this.getSelectedId() === id)
                            this.callEvent("onAfterSelect",[id]);
                        return true;
                    },
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
                    async onAfterSelect(id) {
                        const item = this.getItem(id);
                        if (!item) return false;//TODO or true
                        const tango_host_id = this._get_tango_host_id(item);
                        const tango_host = await PlatformContext.loadAndSetTangoHost(tango_host_id);

                        let device_name;
                        if ((item.isAlias && item.device_name !== undefined) || item.isMember) {
                            device_name = item.device_name;
                        }
                        else if (item.isAlias && item.device_name === undefined) {
                            //TODO send event handle event in controller
                            device_name = await tango_host
                                .fetchDatabase()
                                .then(function (db) {
                                    return db.getAliasDevice(item.value);
                                });
                        } else {
                            tango_host.fetchDatabase().then(db=> {
                                PlatformContext.devices.setCursor(db.id);
                            });

                            return false;
                        }
                        PlatformContext.loadAndSetDevice(`${tango_host_id}/${device_name}`);
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
                        this.load(PlatformContext.rest.url + kDevicesTreeBackendURL + "?host=" + event.data + '&' +
                        PlatformContext.UserContext.device_filters.map(function (it) {
                            return "wildcard=" + it;
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
                        this.updateRoot(event.data.context);
                    },
                    "left_panel_toolbar.click.refresh subscribe"(){
                        //TODO avoid this hardcoded if statement; isVisible always true
                        if($$('left_panel').getChildViews()[0] === this.getParentView().getParentView() &&
                            !$$('left_panel').getChildViews()[0].config.collapsed)
                            this.updateRoot();
                    }
                }
            }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.IdSpace, webix.EventSystem, webix.ui.tree);

    /**
     * Extends {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
     * @property {filter} txtFilter
     * @property {tree} devices-tree
     * @memberof ui.DevicesTree
     * @namespace devices_tree
     */
    var devices_tree = webix.protoUI(
        /** @lends  devices_tree.prototype */
        {
            name: 'devices_tree',
            get tree(){
                return this.$$('devices-tree');
            },
            /**
             *
             * @param {string} tango_host
             * @private
             */
            _update_header:function(tango_host){
                $$("devices_tree_panel").config.header = webix.template(function () {
                    return kDevicesTreePanelHeaderIcon + tango_host;
                });
                $$("devices_tree_panel").refresh();
            },
            _ui: function (config) {
                return {
                    width: 300,
                    rows: [
                        newSearch("devices-tree", "#value#"),
                        {
                            borderless:true,
                            context: config.context,
                            view: "devices_tree_tree",
                            id: "devices-tree"
                        }
                    ]
                };
            },
            /**
             * Required for {@link bind}
             *
             * @private
             */
            setValue:function(host){
                if(!host) return;

                this._update_header(host.id);
            },
            /**
             * @memberof ui.DevicesTree.devices_tree
             * @constructs
             */
            $init: function (config) {
                webix.extend(config, this._ui(config));
                this.$ready.push(function(){
                    this.bind(config.context.tango_hosts)
                }.bind(this));
            }
        }, webix.IdSpace, webix.ui.layout);


    /**
     * @constant
     * @memberof ui.DevicesTree
     * @type {string}
     */
    const kDevicesTreePanelHeaderIcon = "<span class='webix_icon mdi mdi-sitemap'></span>";
    /**
     * @constant
     * @memberof ui.DevicesTree
     * @type {string}
     */
    const kDevicesTreePanelHeader = `${kDevicesTreePanelHeaderIcon}Tango hosts`;

    /**
     *
     * @param {PlatformContext} context
     * @returns {devices_tree}
     * @memberof ui.DevicesTree
     */
    TangoWebapp.ui.newDevicesTree = function(context){
        return {
            header: kDevicesTreePanelHeader,
            id: "devices_tree_panel",
            body: {
                context: context,
                view: 'devices_tree',
                id: 'devices_tree'
            }
        }
    }
})();

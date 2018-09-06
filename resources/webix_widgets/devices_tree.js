/** @module DevicesTree*/
(function () {
    /**
     *
     * @type {webix.ui.config}
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
                var hostId = tree._get_host_id(item);
                var name = tree._get_device_name(item);
                var device_id = hostId + "/" + name;

                OpenAjax.hub.publish("tango_webapp.device_" + id, {
                    data: {
                        id: device_id,
                        host_id: hostId,
                        name: name,
                        tab: 'device-properties'
                    }
                });
            }
        }
    };

    /**
     * @type {webix.protoUI}
     */
    var tree = webix.protoUI({
        devices_filter: null,
        name: 'devices_tree_tree',
        populateTree:function(id){
            function r(localId) {
                for (var id = this.getFirstChildId(localId); id; id = this.getNextSiblingId(id)) {
                    this.loadTree(id).then(function (localId) {
                        r.bind(this)(localId);
                    }.bind(this, id));
                }
            };
            r.bind(this)(id);

        },
        /**
         * loads children of the id
         *
         * @param id
         * @return {Promise}
         */
        loadTree: function(id){
            this.showProgress({
                type: "icon"
            });
            var item = this.getItem(id);

            var tango_host_id = this._get_host_id(item);
            var tango_host = PlatformContext.tango_hosts.getItem(tango_host_id);

            var self = this;
            switch (item.$level) {
                case 1://root
                    return this._expand_root().then(function(){
                        self.hideProgress();
                    });
                case 2://tango_host
                    return this._expand_tango_host(tango_host).then(function(domains){
                        self.parse({
                            parent: id,
                            data: domains
                        });
                        self.hideProgress();
                    });
                case 3://domain or aliases
                    return this._expand_domain(tango_host, item._value).then(function(families){
                        self.parse({
                            parent: id,
                            data: families
                        })
                        self.hideProgress();
                    });
                case 4://family
                    return this._expand_family(item._value).then(function(members){
                        self.parse({
                            parent: id,
                            data: members
                        });
                    }, function (err) {
                        debugger
                    });
            }
        },
        _expand_root:function(){
            var data = {
                parent: 'root',
                data: []
            };
            TangoWebappHelpers.iterate(this.config.context.tango_hosts, function (it) {
                data.data.push({
                    id: it.id,
                    value: it.id,
                    _value: it,
                    //TODO bind host node data to context.devices
                    webix_kids: it.is_alive,
                    $css: 'tango_host'
                });
            });

            return new webix.promise(function(){
                this.parse(data);
            }.bind(this));
        },
        /**
         *
         * @param tango_host
         * @param id
         * @return {Promise} an array of domains
         * @private
         */
        _expand_tango_host:function(tango_host){
            var filter = PlatformContext.UserContext.toDeviceFilter();
            return webix.promise.all(filter.getDomainFilters().map(function (it) {
                return tango_host.fetchDomains(it)
                    .fail(function () {
                        //TODO throw exception/OpenAjax event
                        return [];
                    })
                    .then(function (resp) {
                        return [{value: 'aliases', _value: 'aliases', webix_kids: true, $css: 'domain'}]
                            .concat(resp.map(function (el) {
                            return {value: el.value, _value: el, isDomain: true, webix_kids: true, $css: 'domain'};
                        }));
                    });
            })).then(function(filtered_domains){
                return Array.prototype.concat.apply([], filtered_domains); //flatten an array of arrays
            });
        },

        /**
         *
         * @param tango_host
         * @param {TangoDomain} domain
         * @return {Promise}
         * @private
         */
        _expand_domain:function(tango_host, domain){
            if(domain === 'aliases')
                return tango_host.fetchAliases()
                    .then(function(aliases){
                        return aliases.map(function(it){
                            return {value: it.value, _value: it, isAlias: true, $css: 'member'};
                        });
                    });

            var filter = PlatformContext.UserContext.toDeviceFilter();
            return webix.promise.all(filter.getFamilyFilters(domain.value).map(function (it) {
                return domain.fetchFamilies(it)
                    .then(function (resp) {
                        return resp.map(function (el) {
                            return {value: el.value, _value: el, webix_kids: true, $css: 'family'};
                        });
                    })
            })).then(function(filtered_families){
                return Array.prototype.concat.apply([], filtered_families);//flatten an array of arrays
            });
        },
        /**
         *
         * @param family
         * @return {Promise}
         * @private
         */
        _expand_family: function(family){
            var filter = PlatformContext.UserContext.toDeviceFilter();
            return webix.promise.all(filter.getMemberFilters(family.domain.value, family.value).map(function (it) {
                return family.fetchMembers(it)
                        .then(function (resp) {
                                return resp.map(function(member){
                                    return {
                                        $css: 'member',
                                        value: member.value,
                                        _value: member,
                                        isMember: true
                                    }
                                });
                        });
            })).then(function(filtered_members){
                return Array.prototype.concat.apply([], filtered_members);//flatten an array of arrays
            });
        },
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
                webix_kids: true,
                $css: 'rest_host',
                data: []
            };

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
                case 1:
                    return 'root';
                default:
                    TangoWebappPlatform.helpers.debug("_get_host_id called for wrong item: " + item.id);
            }
        },
        /**
         *
         * @param item
         * @private
         */
        _get_device_name: function (item) {
            var member = item._value;
            var family = this.getItem(item.$parent)._value;
            var domain = this.getItem(this.getItem(item.$parent).$parent)._value;
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

            // this.populateTree('root');
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
                    if(item.isAlias || item.$level === 5){
                        this.$$("devices_tree_context_menu").config.master = this;
                        this.select(id);
                        return true;
                    }
                    return false;
                },
                onItemDblClick:function(id){
                    var item = this.getItem(id);
                    if (!item) return false;//TODO or true

                    var tango_host_id;
                    var device_name;
                    switch (item.$level) {
                        case 5://member
                            tango_host_id = this._get_host_id(item);
                            device_name = this._get_device_name(item);

                            PlatformApi.PlatformUIController().expandDeviceTree();
                            break;
                        default:
                            TangoWebappHelpers.debug("device_tree#onItemDblClick " + id);
                    }
                },
                /**
                 * Happens before click events
                 *
                 * @param id
                 * @return {boolean}
                 */
                onAfterSelect: function(id){
                    var item = this.getItem(id);
                    if (!item) return false;//TODO or true
                    switch (item.$level) {
                        case 2://tango host
                            PlatformContext.tango_hosts.setCursor(item._value.id);
                            break;
                        case 3://domain
                        case 4://family or alias
                        case 5://member
                            PlatformContext.tango_hosts.setCursor(item._value.host.id);
                            if(item.isAlias || item.isMember) {
                                item._value.fetchDevice().then(function (device) {
                                    PlatformContext.devices.setCursor(device.id);
                                });
                            }
                            break;
                        default:
                            TangoWebappHelpers.debug("device_tree#clickOnItem " + id);
                    }
                },
                onDataRequest: function (id, cbk, url) {
                    this.loadTree(id);
                    return false;//block further execution
                },
                "user_context_controller.found subscribe": function (event) {
                    var user_context = event.data;
                    event.controller.devices_filter = new DeviceFilter({
                        user: user_context.user,
                        value: user_context.device_filters
                    });
                },
                "user_context_controller.add_tango_host subscribe": function (event) {
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
                    event.controller.populateTree(event.data);
                },
                "user_context_controller.delete_tango_host subscribe": function (event) {
                    event.controller.remove(event.data);
                },
                "platform_api.ui.initialized subscribe": function (event) {
                    event.controller.updateRoot(event.data.context);
                },
                "platform_context.set_rest subscribe": function (event) {
                    event.controller.updateRoot(event.data);
                }
            }
        }
    }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.IdSpace, webix.EventSystem, webix.ui.tree);


    /**
     * @type {webix.protoUI}
     */
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
        $init: function (config) {
            webix.extend(config, this._ui(config));
        }
    }, webix.ui.layout);

})();

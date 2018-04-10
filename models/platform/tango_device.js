/**
 * Model tango_device
 *
 * @type {TangoDevice}
 */
TangoWebappPlatform.TangoDevice = MVC.Model.extend('tango_device',
    /** @Static */
    {
        store_type: WebixDataCollectionStorage,
        attributes: {
            id: 'string', //host_id/name
            name: 'string',
            alias: 'string',
            host: 'TangoHost',
            info: '{}',
            attrs: '[]',
            commands: '[]',
            pipes: '[]'
        },
        default_attributes: {
            //TODO use not selected as default id or similar - important is that it must be the same as in TangoHost
            name: 'unknown',
            alias: 'unknown',
            host: {
                id: 'unknown'
            },
            info: {}
        }
    },
    /** @Prototype */
    {
        set_admin: function (v) {
            this.admin = v;
        },
        set_host: function (v) {
            this.host = v;
        },
        /**
         *
         * @param v
         */
        set_attrs: function (v) {
            this.attrs = v;
        },
        /**
         *
         * @param v
         */
        set_commands: function (v) {
            this.commands = v;
        },
        /**
         *
         * @param v
         */
        set_properties: function (v) {
            this.properties = v;
        },
        set_display_name: function(v){
            this.display_name = v;
        },
        /**
         *
         * @param v
         */
        set_pipes: function (v) {
            this.pipes = v;
        },
        _sync:function(what, master){
            var id = this.id;
            this[what].data.sync(master,function(){
                this.filter(function(obj){
                    return obj.device_id === id;
                });
            });
        },
        /**
         *
         * @param attrs
         * @constructor
         */
        init: function (attrs) {
            //we can not just set these properties here i.e. this.attrs = ...
            //in this case the property will be shared across all instances
            this._super(MVC.Object.extend(attrs, {
                display_name: attrs.alias ? attrs.alias : attrs.name,//TODO wrap into an entity that will resolve this globally
                attrs: new webix.DataCollection(),
                commands: new webix.DataCollection(),
                pipes: new webix.DataCollection(),
                properties: new webix.DataCollection(),
                attr_infos: new webix.DataCollection()
            }));

            var sort = function(){
                this.sort("#name#", "asc", "string");
            };
            this.attrs.waitData.then(sort.bind(this.attrs));
            this.commands.waitData.then(sort.bind(this.commands));
            this.pipes.waitData.then(sort.bind(this.pipes));
            this.properties.waitData.then(sort.bind(this.properties));
        },
        /**
         *
         * @private
         */
        _attach_attrs_info: function () {
            return function (attributes) {
                var self = this;
                var attr_names = attributes.map(function (it) {
                    return it.name;
                });

                var promise_info = this.host.rest.request().hosts(this.host.toUrl()).devices(this.name).attributes('info')
                    .get('?' + attr_names.map(function (it) {
                        return "attr=" + it;
                    }).join('&'));

                return promise_info.then(function (infos) {
                    var result = TangoAttributeInfo.create_many_as_existing(infos.map(function(info, ndx){
                        return MVC.Object.extend(info, {
                            attr: attributes[ndx]
                        })
                    }));
                    self.attr_infos.parse(result);
                    return attributes;
                });
            }.bind(this);
        },
        /**
         * @returns {Promise}
         */
        fetchAttrs: function () {
            return this.toTangoRestApiRequest().attributes().get()
                .then(function (resp) {
                    var attrs= TangoAttribute.create_many_as_existing(
                        resp.map(function (it) {
                            return MVC.Object.extend(it, {
                                id: this.id + "/" + it.name,
                                device_id: this.id
                            })
                        }.bind(this)));
                    this.attrs.parse(attrs);
                    return attrs;
                }.bind(this))
                .then(this._attach_attrs_info())
                .fail(function (resp) {
                    TangoWebappHelpers.error(resp);
                    throw resp;
                });
        },
        /**
         *
         * @param attrs
         * @returns {Promise}
         */
        fetchAttrValues: function (attrs) {
            return this.toTangoRestApiRequest().attributes('value')
                .get('?' + attrs.map(function (attr) {
                    return "attr=" + attr
                }).join('&')).fail(function (resp) {
                    TangoWebappHelpers.error(resp);
                    throw resp;
                });
        },
        /**
         *
         * @returns {Promise}
         */
        fetchCommands: function () {
            return this.toTangoRestApiRequest().commands().get().then(function (resp) {
                var commands = TangoCommand.create_many_as_existing(
                    resp.map(function (it) {
                        return MVC.Object.extend(it, {
                            id: this.id + "/" + it.name,
                            device_id: this.id
                        })
                    }.bind(this)));
                this.commands.parse(commands);
                return commands;
            }.bind(this));
        },
        /**
         * @returns {Promise}
         */
        fetchPipes: function () {
            return this.toTangoRestApiRequest().pipes().get().then(function (resp) {
                var pipes = TangoPipe.create_many_as_existing(
                    resp.map(function (it) {
                        return MVC.Object.extend(it, {
                            id: this.id + "/" + it.name,
                            device_id: this.id
                        })
                    }.bind(this)));
                this.pipes.parse(pipes);
                return pipes;
            }.bind(this));
        },
        /**
         * @returns {webix.promise}
         */
        fetchAdmin: function () {
            return this.host.fetchDevice('dserver/' + this.info.admin)
                .then(function (device) {
                    var admin = new TangoAdminDevice({
                        id: device.id,
                        device: device
                    });
                    this.set_admin(admin);
                    return admin;
                }.bind(this))
        },
        /**
         *
         * @returns {Promise}
         */
        fetchProperties: function () {
            return this.toTangoRestApiRequest().properties().get().then(function (resp) {
                var properties = TangoDeviceProperty.create_many_as_existing(
                    resp.map(function (it) {
                        return MVC.Object.extend(it, {
                            id: this.id + "/" + it.name
                        })
                    }.bind(this)));
                this.properties.parse(properties);
                return properties;
            }.bind(this));
        },
        /**
         *
         * @param cmd
         * @param arg
         * @return {webix.promise}
         */
        executeCommand: function (cmd, arg) {
            return this.toTangoRestApiRequest().commands(cmd).exec(arg);
        },
        /**
         *
         * @param {{attr:value}} values
         * @returns {webix.protoUI}
         */
        putAttrValues: function (values) {
            var x = [];
            for (var attr in values) {
                if (values.hasOwnProperty(attr)) x.push(attr + '=' + values[attr]);
            }
            return this.toTangoRestApiRequest().attributes('value').put('?' + x.join('&'));
        },
        /**
         *
         * @param {prop:[]} props
         * @returns {webix.promise}
         */
        putProperties: function (props) {
            function toUrl(props) {
                var result = [];
                for (var p in props) {
                    if (!props.hasOwnProperty(p)) continue;

                    var values = props[p];
                    result.push.apply(result, values.map(function (el) {
                        return p + "=" + el;
                    }));
                }
                return result.join('&');
            }

            return this.toTangoRestApiRequest().properties().put('?' + toUrl(props));
        },
        /**
         *
         * @param name
         * @returns {*|webix.promise}
         */
        deleteProperty: function (name) {
            return this.toTangoRestApiRequest().properties().delete('/' + name);
        },
        /**
         *
         */
        toTangoRestApiRequest: function () {
            return this.host.rest.request().hosts(this.host.toUrl()).devices(this.name);
        },
        /**
         *
         * @param name
         * @returns {*|webix.promise}
         */
        readPipe: function (name) {
            return this.toTangoRestApiRequest().pipes(name).get();
        },
        /**
         *
         * @param {string} name
         * @param {Object} obj
         * @return {*|webix.promise}
         */
        writePipe: function (name, obj) {
            return this.toTangoRestApiRequest().pipes(name).put("", obj);
        }
    }
);

if (window['TangoDevice'] === undefined)
    TangoDevice = TangoWebappPlatform.TangoDevice;
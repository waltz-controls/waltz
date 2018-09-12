/**
 * Model tango_device
 *
 * @class
 * @memberof tango
 * @property {string} id - host_id/name
 * @property {string} name - host_id/name
 * @property {string} alias - host_id/name
 * @property {TangoHost} host - host_id/name
 * @property {Object} info - host_id/name
 * @property {[]} attrs - host_id/name
 * @property {[]} commands - host_id/name
 * @property {[]} pipes - host_id/name
 * @extends DataCollectionWrapper
 */
TangoDevice = TangoWebappPlatform.TangoDevice = TangoWebappPlatform.DataCollectionWrapper.extend('tango_device',
    /** @lends tango.TangoDevice */
    {
        attributes: {
            id: 'string',
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
            id: undefined, //host_id/name
            name: undefined,
            alias: undefined,
            host: {
                id: undefined
            },
            info: {}
        }
    },
    /** @lends tango.TangoDevice.prototype */
    {
        /**
         *
         * @private
         */
        admin: null,
        /**
         *
         * @param v
         * @private
         */
        set_admin: function (v) {
            this.admin = v;
        },
        /**
         *
         * @param v
         * @private
         */
        set_host: function (v) {
            this.host = v;
        },
        /**
         *
         * @param v
         * @private
         */
        set_attrs: function (v) {
            this.attrs = v;
        },
        /**
         *
         * @param v
         * @private
         */
        set_commands: function (v) {
            this.commands = v;
        },
        /**
         *
         * @param v
         * @private
         */
        set_properties: function (v) {
            this.properties = v;
        },
        /**
         *
         * @param v
         * @private
         */
        set_display_name: function (v) {
            this.display_name = v;
        },
        /**
         *
         * @param v
         * @private
         */
        set_pipes: function (v) {
            this.pipes = v;
        },
        /**
         *
         * @private
         */
        _update_item:function(collection, item){
            if(collection.exists(item.id))
                collection.updateItem(item.id, item);
            else
                collection.add(item);
        },
        /**
         *
         * @private
         */
        _get_extension:function(it){
            return {
                id: this.id + "/" + it.name,
                device_id: this.id
            }
        },
        /**
         *
         * @param attrs
         * @constructs
         * @override
         */
        init: function (attrs) {
            //we can not just set these properties here i.e. this.attrs = ...
            //in this case the property will be shared across all instances
            this._super(MVC.Object.extend(attrs, {
                display_name: attrs.alias ? attrs.alias : attrs.name,//TODO wrap into an entity that will resolve this globally
                attrs: new webix.DataCollection(),
                commands: new webix.DataCollection(),
                pipes: new webix.DataCollection(),
                properties: new webix.DataCollection()
            }));
            var sort = function () {
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
                var attr_names = attributes.map(function (it) {
                    return it.name;
                });

                var promise_info = this.host.rest.request().hosts(this.host.toUrl()).devices(this.name).attributes('info')
                    .get('?' + attr_names.map(function (it) {
                        return "attr=" + it;
                    }).join('&'));

                return promise_info.then(function (infos) {
                    for (var i = 0; i < infos.length; ++i)
                        attributes[i].set_attributes({
                            display_name:infos[i].label,
                            info: infos[i]
                        })
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
                    return TangoAttribute.create_many_as_existing(
                        resp.map(function (it) {
                            return MVC.Object.extend(it, this._get_extension(it))
                        }.bind(this)));
                }.bind(this))
                .then(this._attach_attrs_info())
                .then(function (attributes) {
                    this.attrs.parse(attributes);
                    return attributes;
                }.bind(this))
                .fail(function (resp) {
                    TangoWebappHelpers.error(resp);
                    throw resp;
                });
        },
        /**
         * @param {string} name
         * @returns {Promise}
         */
        fetchAttr: function (name) {
            return this.toTangoRestApiRequest().attributes(name).get()
                .then(function (resp) {
                    return [TangoAttribute.create_as_existing(
                        MVC.Object.extend(resp, this._get_extension(resp)))];
                }.bind(this))
                .then(this._attach_attrs_info())
                .then(function (attributes) {
                    this.attrs.parse(attributes);//TODO update?
                    return attributes[0];
                }.bind(this))
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
                        return MVC.Object.extend(it, this._get_extension(it))
                    }.bind(this)));
                this.commands.parse(commands);
                return commands;
            }.bind(this));
        },
        /**
         *
         * @param {string} name
         * @returns {Promise}
         */
        fetchCommand: function (name) {
            return this.toTangoRestApiRequest().commands(name).get().then(function (resp) {
                var command = TangoCommand.create_as_existing(
                        MVC.Object.extend(resp, this._get_extension(resp)));
                this._update_item(this.commands, command);
                return command;
            }.bind(this));
        },
        /**
         *
         * @returns {Promise}
         */
        fetchPipes: function () {
            return this.toTangoRestApiRequest().pipes().get().then(function (resp) {
                var pipes = TangoPipe.create_many_as_existing(
                    resp.map(function (it) {
                        return MVC.Object.extend(it, this._get_extension(it))
                    }.bind(this)));
                this.pipes.parse(pipes);
                return pipes;
            }.bind(this));
        },
        /**
         *
         * @returns {Promise}
         */
        fetchPipe: function (name) {
            return this.toTangoRestApiRequest().pipes(name).get().then(function (resp) {
                var pipe = TangoPipe.create_as_existing(
                        MVC.Object.extend(resp, this._get_extension(resp)));
                this._update_item(this.pipes, pipe);
                return pipe;
            }.bind(this));
        },
        /**
         *
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
                        return MVC.Object.extend(it, this._get_extension(it))
                    }.bind(this)));
                this.properties.parse(properties);
                return properties;
            }.bind(this));
        },
        /**
         *
         * @param {string} name
         * @returns {Promise}
         */
        fetchProperty: function (name) {
            return this.toTangoRestApiRequest().properties(name).get().then(function (resp) {
                var property = TangoDeviceProperty.create_as_existing(
                        MVC.Object.extend(resp, this._get_extension(resp))
                        );
                this._update_item(property);
                return property;
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
            return this.toTangoRestApiRequest().attributes('value').put('?' + x.join('&') + '&async=true');
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
         * @return {TangoRestApiRequest}
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
        },
        /**
         *
         * @return {string}
         */
        getIcon:function(){
            return 'fa-microchip';
        }
    }
    );
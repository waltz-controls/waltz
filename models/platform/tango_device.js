/**
 * Model tango_device
 *
 * @type {TangoDevice}
 */
TangoWebapp.TangoDevice = TangoWebapp.DataCollectionWrapper.extend('tango_device',
    /** @Static */
    {
        attributes: {
            id: 'string', //host_id/name
            name: 'string',
            info: '{}',
            attrs: '[]',
            commands: '[]',
            pipes: '[]'
        },
        default_attributes: {
            //TODO use not selected as default id or similar - important is that it must be the same as in TangoHost
            id: 'unknown', //host_id/name
            name: 'not selected',
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
        set_pipes: function (v) {
            this.pipes = v;
        },
        /**
         *
         * @param attrs
         */
        init: function (attrs) {
            //we can not just set these properties here i.e. this.attrs = ...
            //in this case the property will be shared across all instances
            this._super(MVC.Object.extend(attrs, {
                attrs: new webix.DataCollection(),
                commands: new webix.DataCollection(),
                pipes: new webix.DataCollection()
            }));
        },
        /**
         * @returns {Promise}
         */
        fetchAttrs: function () {
            return this.host.rest.request().hosts(this.host.toUrl()).devices(this.name).attributes().get().then(function (resp) {
                var attributes = TangoAttribute.create_many_as_existing(
                    resp.map(function (it) {
                        return MVC.Object.extend(it, {
                            id: this.id + "/" + it.name
                        })
                    }.bind(this)));
                this.attrs.parse(attributes);
                return attributes;
            }.bind(this));
        },
        /**
         *
         * @returns {Promise}
         */
        fetchCommands: function () {
            return this.host.rest.request().hosts(this.host.toUrl()).devices(this.name).commands().get().then(function (resp) {
                var commands = TangoCommand.create_many_as_existing(
                    resp.map(function (it) {
                        return MVC.Object.extend(it, {
                            id: this.id + "/" + it.name
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
            return this.host.rest.request().hosts(this.host.toUrl()).devices(this.name).pipes().get().then(function (resp) {
                var pipes = TangoPipe.create_many_as_existing(
                    resp.map(function (it) {
                        return MVC.Object.extend(it, {
                            id: this.id + "/" + it.name
                        })
                    }.bind(this)));
                this.pipes.parse(pipes);
                return pipes;
            }.bind(this));
        },
        fetchAdmin: function () {

        },
        /**
         *
         * @param cmd
         * @param arg
         * @return {Promise}
         */
        executeCommand: function (cmd, arg) {
            return this.host.rest.request().hosts(this.host.toUrl()).devices(this.name).commands(cmd).exec(arg);
        }
    }
);

if (window['TangoDevice'] === undefined)
    TangoDevice = TangoWebapp.TangoDevice;
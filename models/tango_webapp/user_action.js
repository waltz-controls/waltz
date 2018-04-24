/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/24/18
 */
TangoWebapp.UserAction = MVC.Model.extend('user_action',
    /** @Static */
    {
        attributes: {
            id: 'number',
            type: 'string',
            value: 'string',
            timestamp: 'number'
        },
        default_attributes: {
            type: 'user_action'
        },
        init: function () {
            this._super();
            //do not store requests in production
            if (MVC.env().match(/production/)) {
                this.store_type = TangoWebappPlatform.DummyStore;
                this.store = new TangoWebappPlatform.DummyStore();
            }
        },
        /**
         *
         * @param {TangoAttribute} attr
         * @returns {webix.promise}
         */
        readAttribute: function (attr) {
            return attr.read().then(
                function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: ['<span class="webix_icon fa-user"></span>', 'Action: read attribute:', result.id, '; Result:', result.info.data_format, '=', (result.isScalar()) ? result.value : '...'].join(' '),
                        timestamp: result.timestamp
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this)).fail(this.failure.bind(this));
        },
        /**
         *
         * @param {TangoAttribute} attr
         * @param {any} arg
         * @returns {webix.promise}
         */
        writeAttribute: function (attr, arg) {
            return attr.write(arg).then(function (result) {
                var instance = new this({
                    id: webix.uid(),
                    value: ['<span class="webix_icon fa-user"></span>', 'Action: write attribute:', result.id, '; Value:', result.value].join(' '),
                    timestamp: result.timestamp || +new Date()
                });
                this.publish('log', {data: instance});
                return result;
            }.bind(this))
                .fail(this.failure.bind(this));

        },
        /**
         *
         * @param {TangoCommand} cmd
         * @param {any} argin
         * @returns {webix.promise}
         */
        executeCommand: function (cmd, argin) {
            return cmd.execute(argin)
                .then(function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: ['<span class="webix_icon fa-user"></span>', 'Action: execute command:', result.id, '; Input:', result.input, '; Ouput:', result.output].join(' '),
                        timestamp: +new Date()
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        /**
         *
         * @param {TangoPipe} pipe
         * @returns {webix.promise}
         */
        readPipe: function (pipe) {
            return pipe.read()
                .then(function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: ['<span class="webix_icon fa-user"></span>', 'Action: read_pipe:', result.id, '; Size:', result.size].join(' '),
                        timestamp: result.timestamp
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        /**
         *
         * @param {TangoPipe} pipe
         * @param {any} data
         * @returns {webix.promise}
         */
        writePipe: function (pipe, data) {
            return pipe.write(data)
                .then(function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: ['<span class="webix_icon fa-user"></span>', 'Action: read_pipe:', result.id, '; Size:', result.size].join(' '),
                        timestamp: result.timestamp
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        //TODO open(load) tango host
        //TODO open(load) tango device
        //TODO read(write) tango device property
        //TODO etc
        /**
         *
         * @param {Error} err
         */
        failure: function (err) {
            debugger
            var instance = new this({
                id: webix.uid(),
                type: 'error',
                value: ['<span class="webix_icon fa-user"></span>', 'User action has failed:\n'].concat(err.errors).join(' '), //TODO errors - errors objects
                timestamp: err.timestamp || +new Date()
            });
            this.publish('log', {data: instance});
            throw err;
        }
    },
    /** @Prototype */
    {});

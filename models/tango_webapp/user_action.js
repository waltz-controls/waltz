/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/24/18
 */
UserAction = TangoWebapp.UserAction = MVC.Model.extend('user_action',
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
        _get_user:function(){
            return ['<span class="webix_icon fa-user"></span>',PlatformContext.UserContext.user,';'];
        },
        _get_attr_value:function(attr){
            return [attr.info.data_format, '=', (attr.isScalar()) ? attr.value : '...']
        },
        _check_attr_invalid_quality_error:function(attr){
            if(attr.quality === 'FAILURE') {
                attr.add_errors([
                    TangoWebappHelpers.newTangoError({
                        reason: 'Attribute has invalid quality',
                        description: ['Attribute[', attr.display_name, '] quality is FAILURE!'].join(''),
                        severity: 'ERR',
                        origin: attr.id
                    })]);
                throw attr;
            }
        },
        _check_attr_invalid_value_error:function(attr, arg){
            if(attr.value != arg/* it is important to use relaxed comparison here as arg may be string and actual value is number*/) {
                attr.add_errors([
                    TangoWebappHelpers.newTangoError({
                        reason: 'Write attribute has failed',
                        description: ['Returned value[', attr.display_name, '] does not match argument[', arg, ']'].join(''),
                        severity: 'ERR',
                        origin: attr.id
                    })]);
                throw error;
            }
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
            return attr.read()
                .then(function(attr){
                    this._check_attr_invalid_quality_error(attr);
                    return attr;
                }.bind(this))
                .then(
                    function (result) {
                        var instance = new this({
                            id: webix.uid(),
                            value: this._get_user().concat(['Action: read attribute:', result.id, '; Result:']).concat(this._get_attr_value(result)).join(' '),
                            timestamp: result.timestamp
                        });
                        this.publish('log', {data: instance});
                        return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        /**
         *
         * @param {TangoAttribute} attr
         */
        readAttributeHistory:function(attr){
            return attr.fetchHistory().then(
                function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: this._get_user().concat(['Action: read attribute history:', result.id, '; History length:', result.history.length]).join(' '),
                        timestamp: result.timestamp
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        /**
         *
         *
         * @param {TangoAttribute} attr
         * @param {any} arg
         * @returns {webix.promise}
         */
        writeAttribute: function (attr, arg) {
            return attr.write(arg)
                .then(function(attr){
                    this._check_attr_invalid_quality_error(attr);
                    this._check_attr_invalid_value_error(attr,arg);
                    return attr;
                }.bind(this))
                .then(function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: this._get_user().concat(['Action: write attribute[', result.id, '] Value:', result.value,'; Result:']).concat(this._get_attr_value(result)).join(' '),
                        timestamp: result.timestamp || +new Date()
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));

        },
        /**
         *
         * @param {TangoAttribute} attr
         */
        updateAttributeInfo:function(attr){
            return attr.putInfo()
                .then(function(/*async*/){
                    var instance = new this({
                        id: webix.uid(),
                        value: this._get_user().concat(['Action: update attribute info[', attr.id, ']']).join(' '),
                        timestamp: +new Date()
                    });
                    this.publish('log', {data: instance});
                    return attr;
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
                        value: this._get_user().concat(['Action: execute command:', result.id, '; Input:', result.input, '; Ouput:', result.output]).join(' '),
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
                        value: this._get_user().concat(['Action: read_pipe:', result.id, '; Size:', result.size]).join(' '),
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
                        value: this._get_user().concat(['Action: write_pipe:', result.id, '; Size:', result.size]).join(' '),
                        timestamp: result.timestamp
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        /**
         *
         * @param {TangoDevice} device
         * @returns {webix.promise}
         */
        readDeviceProperties: function (device) {
            return device.fetchProperties()
                .then(function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: this._get_user().concat(['Action: read_device_properties:', device.id, '; Properties:', result.length]).join(' '),
                        timestamp: +new Date()
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        /**
         *
         * @param {TangoDevice} device
         * @param {prop:[]} props
         * @returns {webix.promise}
         */
        writeDeviceProperties: function (device, props) {
            return device.putProperties(props)
                .then(function (result) {
                    var instance = new this({
                        id: webix.uid(),
                        value: this._get_user().concat(['Action: write_device_properties:', device.id, '; Properties:', result.length]).join(' '),
                        timestamp: +new Date()
                    });
                    this.publish('log', {data: instance});
                    return result;
                }.bind(this))
                .fail(this.failure.bind(this));
        },
        /**
         *
         * @param {UserScript} script
         */
        executeUserScript:function(script){
            return script.execute().then(function (result) {
                var instance = new this({
                    id: webix.uid(),
                    value: this._get_user().concat(['Action: execute_script:', script.name]).join(' '),
                    timestamp: +new Date()
                });
                this.publish('log', {data: instance});
                return result;
            }.bind(this))
                .fail(this.failure.bind(this));
        },
        //TODO open(load) tango host
        //TODO open(load) tango device
        //TODO etc
        /**
         *
         * @param {*} err
         */
        failure: function (err) {
            var instance = new this({
                id: webix.uid(),
                type: 'error',
                value: this._get_user().concat(['User action has failed:\n']).concat(err.errors).join(' '), //TODO errors - errors objects
                timestamp: err.timestamp || +new Date()
            });
            this.publish('log', {data: instance});
            throw err;
        }
    },
    /** @Prototype */
    {});

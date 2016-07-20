MockDevice = Device.extend(
    /*@Prototype */
    {
        //properties reference to promise objects
        _info             : {
            name           : "mock_device",
            type_id        : "5",
            oir            : "...",
            iiop_version   : "1.2",
            host           : "",
            port           : 0,
            server         : "MockDevice",
            server_pid     : 0,
            exported       : true,
            last_exported  : "now",
            last_unexported: "now"
        },
        _commands         : [
            {
                "name": "DevString",
                "info": {
                    "level"        : "OPERATOR",
                    "cmd_tag"      : 0,
                    "in_type"      : "DevString",
                    "out_type"     : "DevString",
                    "in_type_desc" : "-",
                    "out_type_desc": "-"
                }
            },
            {
                "name": "DevDouble",
                "info": {
                    "level"        : "OPERATOR",
                    "cmd_tag"      : 0,
                    "in_type"      : "DevDouble",
                    "out_type"     : "DevDouble",
                    "in_type_desc" : "-",
                    "out_type_desc": "-"
                }
            },
            {
                "name": "DevLong",
                "info": {
                    "level"        : "OPERATOR",
                    "cmd_tag"      : 0,
                    "in_type"      : "DevLong",
                    "out_type"     : "DevLong",
                    "in_type_desc" : "-",
                    "out_type_desc": "-"
                }
            },
            {
                "name": "DevVoid",
                "info": {
                    "level"        : "OPERATOR",
                    "cmd_tag"      : 0,
                    "in_type"      : "DevVoid",
                    "out_type"     : "DevVoid",
                    "in_type_desc" : "-",
                    "out_type_desc": "-"
                }
            }
        ],
        _attributes       : [
            {
                "name": "long_scalar_w"
            },
            {
                "name": "double_scalar_w"
            },
            {
                "name": "string"
            },
            {
                "name": "image"
            }
        ],
        _pipes            : [
            {
                "name"     : "pipe",
                "size"     : 3,
                "timestamp": 123456789,
                "data"     : [
                    {
                        "name" : "pipe-string",
                        "value": ["Hello Tango!"]
                    },
                    {
                        "name" : "pipe-long",
                        "value": [123]
                    },
                    {
                        "name" : "pipe-blob",
                        "value": [{
                            "name": "pipe-blob-string",
                            "data": ["Hello Again!!!"]
                        }, {
                            "name": "pipe-blob-long",
                            "data": [7890]
                        }]
                    }
                ]
            }
        ],
        _properties       : [
            {name: "a", values: ["a property"]},
            {name: "b", values: ["b property"]},
            {name: "c", values: ["c property"]}
        ],
        _state            : {
            state : "ON",
            status: "Always ON"
        },
        _commands_rvalues : {
            DevString: "DevString has been executed",
            DevDouble: 2.78,
            DevLong  : 42,
            DevVoid  : null
        },
        _attributes_values: {
            long_scalar_w  : 1234,
            double_scalar_w: 3.14,
            string         : "Hi, I am a mock device!",
            image          : "TODO"
        },
        _properties_values: {
            a: "property a",
            b: "property b",
            c: "property c"
        },
        /**
         *
         * @constructor
         * @param name
         */
        init              : function () {
            this._super("mock_device");
        },
        /**
         *
         * @return promise
         */
        info              : function () {
            return webix.promise.fcall(function () {
                return this._info;
            }.bind(this));
        },
        /**
         *
         * @return promise
         */
        commands          : function () {
            return webix.promise.fcall(function () {
                return this._commands;
            }.bind(this));
        },
        /**
         *
         * @return promise
         */
        attributes        : function () {
            return webix.promise.fcall(function () {
                return this._attributes;
            }.bind(this));
        },
        pipes             : function () {
            return webix.promise.fcall(function () {
                return this._pipes;
            }.bind(this));
        },
        /**
         *
         * @return promise
         */
        properties        : function () {
            return webix.promise.fcall(function () {
                return this._properties;
            }.bind(this));
        },
        /**
         *
         * @return promise
         */
        state             : function () {
            return webix.promise.fcall(function () {
                return this._state;
            }.bind(this));
        },
        update            : function () {
            //noop
        },
        executeCommand    : function (cmd, argin) {
            return webix.promise.fcall(function () {
                return this._commands_rvalues[cmd];
            }.bind(this));
        },
        readAttribute     : function (attr) {
            return webix.promise.fcall(function () {
                return this._attributes_values[attr];
            }.bind(this));
        },
        writeAttribute    : function (attr, argin) {
            return webix.promise.fcall(function () {
                return this._attributes_values[attr] = argin;
            }.bind(this));
        },
        updateProperties  : function (props) {
            this._properties_values = props;
            this._properties = [];
            for (var p in props) {
                if (!props.hasOwnProperty(p)) continue;

                this._properties.push({name: p, values: props[p]});
            }
        },
        deleteProperty    : function (name) {
            delete this._properties_values[name];
            this._properties = this._properties.filter(function (el) {
                return el.name === name;
            });
        },
        readPipe          : function (name) {
            return webix.promise.fcall(function () {
                return this._pipes[0];
            }.bind(this));

        },
        writePipe         : function (name, obj) {
            return webix.promise.fcall(function () {
                return this._pipes[0] = obj;
            }.bind(this));
        }
    }
);
Device = MVC.Model.extend("device",
    /*@Static */
    {
        fetch:function(inst){
            return inst.api.devices(inst.name).get();
        }
    },
    /*@Prototype */
    {
        id: null,
        api: null,
        _db: null,
        //properties reference to promise objects
        _admin:null,
        _info:null,
        _commands:null,
        _attributes:null,
        _pipes: null,
        _properties:null,
        _attributesInfo: null,
        /**
         *
         * @constructor
         * @param name
         * @param api -- tango rest api
         */
        init: function(name, dbId, api){
            this._super({name:name, id: dbId + '/' + name});
            this.api = api;
        },
        /**
         *
         * @return promise
         */
        info:function(){
            if(this._info == null){
                this.update();
            }
            return this._info;
        },
        /**
         *
         * @return promise
         */
        commands:function(){
            if(this._commands == null){
                this.update();
            }
            return this._commands;
        },
        /**
         *
         * @return promise
         */
        attributes:function(){
            if(this._attributes == null){
                this.update();
            }
            return this._attributes;
        },
        /**
         * @return promise
         */
        attributeInfo:function(attr){
            return this.api.devices(this.name).attributes(attr).get('/info');
        },
        pipes:function(){
            var pipes = this.api.devices(this.name).get("/pipes");
            return pipes;
            //TODO mTangoSDK #103
            //if(this._pipes == null){
            //    this.update();
            //}
            //return this._pipes;
        },
        /**
         *
         * @return promise
         */
        properties:function(){
            var properties = this.api.devices(this.name).get("/properties");
            return properties;
        },
        /**
         *
         * @return promise
         */
        state:function(){
            return this.api.devices(this.name).get("/state");
        },
        update:function(){
            var promise = this.Class.fetch(this);
            this._info = promise.then(function(dev){return dev.info;});
            this._attributes = promise.then(function(dev){ return dev.attributes;});
            this._commands = promise.then(function(dev){ return dev.commands;});
            this._pipes = promise.then(function(dev){ return dev.pipes;});
        },
        executeCommand:function(cmd, argin){
            var command = this.api.devices(this.name).commands(cmd);
            if(argin && argin != "")
                return command.exec('input',argin);
            else
                return command.exec();
        },
        readAttribute:function(attr){
            return this.api.devices(this.name).attributes(attr).get('/value');
        },
        writeAttribute:function(attr, argin){
            return this.api.devices(this.name).attributes(attr).put('?value=' + argin)
        },
        attributesInfo:function(){
            var self = this;
            if(this._attributesInfo) return this._attributesInfo;
            else
            return this._attributesInfo = this.attributes().then(function (attrs) {
                return webix.promise.all(attrs.map(function (attr) {
                    return self.attributeInfo(attr.name);
                }));
            });
        },
        updateProperties: function (props) {
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

            this.api.devices(this.name).properties().put('?' + toUrl(props));
        },
        deleteProperty: function (name) {
            this.api.devices(this.name).properties().delete('/' + name);
        },
        readPipe:function(name){
            return this.api.devices(this.name).pipes(name).get();
        },
        writePipe:function(name, obj){
            return this.api.devices(this.name).pipes(name).put("",obj);
        }
    }
);
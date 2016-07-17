Device = MVC.Model.extend("device",
    /*@Static */
    {
        id: 'name',
        fetch:function(inst){
            return TangoWebapp.rest.devices(inst.name).get();
        }
    },
    /*@Prototype */
    {
        //properties reference to promise objects
        _info:null,
        _commands:null,
        _attributes:null,
        _pipes: null,
        _properties:null,
        /**
         *
         * @constructor
         * @param name
         */
        init: function(name){
            this._super({name:name});
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
        pipes:function(){
            var pipes = TangoWebapp.rest.devices(this.name).get("/pipes");
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
            var properties = TangoWebapp.rest.devices(this.name).get("/properties");
            return properties;
        },
        /**
         *
         * @return promise
         */
        state:function(){
            return TangoWebapp.rest.devices(this.name).get("/state");
        },
        update:function(){
            var promise = this.Class.fetch(this);
            this._info = promise.then(function(dev){return dev.info;});
            this._attributes = promise.then(function(dev){ return dev.attributes;});
            this._commands = promise.then(function(dev){ return dev.commands;});
            this._pipes = promise.then(function(dev){ return dev.pipes;});
        },
        executeCommand:function(cmd, argin){
            var command = TangoWebapp.rest.devices(this.name).commands(cmd);
            if(argin && argin != "")
                return command.exec('input',argin);
            else
                return command.exec();
        },
        readAttribute:function(attr){
            return TangoWebapp.rest.devices(this.name).attributes(attr).get('/value');
        },
        writeAttribute:function(attr, argin){
            return TangoWebapp.rest.devices(this.name).attributes(attr).put('?value=' + argin)
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

            TangoWebapp.rest.devices(this.name).properties().put('?' + toUrl(props));
        },
        deleteProperty: function (name) {
            TangoWebapp.rest.devices(this.name).properties().delete('/' + name);
        },
        readPipe:function(name){
            return TangoWebapp.rest.devices(this.name).pipes(name).get();
        },
        writePipe:function(name, obj){
            return TangoWebapp.rest.devices(this.name).pipes(name).put("",obj);
        }
    }
);
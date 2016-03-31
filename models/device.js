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
        _properties:null,
        /**
         *
         * @constructor
         * @param attrs
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
        /**
         *
         * @return promise
         */
        properties:function(){
            if(this._properties == null){
                this.update();
            }
            return this._properties;
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
            this._properties = promise.then(function(dev){ return dev.properties;});
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
        }

    }
);
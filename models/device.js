Device = MVC.Model.extend("device",
    /*@Static */
    {
        attributes:{
            url: 'string',
            name:'string'
        },
        id: 'url',
        fetch:function(inst){
            //TODO fail
            return webix.ajax().get(inst.__link).then(function(resp) {
                var device = resp.json();
                return device;
            });
        }
    },
    /*@Prototype */
    {
        __link:null,
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
        init:function(attrs){
            this._super(attrs);
            this.__link = this.url + '/devices/' + this.name;
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
            return webix.ajax().get(this.__link + "/state").then(function(resp){
                return resp.json();
            }).fail(function(resp){
                console.error('Request failed!');
                webix.message({type:'error', text:'Request failed!'})//TODO fail
            });
        },
        update:function(){
            var promise = this.Class.fetch(this);
            this._info = promise.then(function(dev){return dev.info;});
            this._attributes = promise.then(function(dev){ return dev.attributes;});
            this._commands = promise.then(function(dev){ return dev.commands;});
            this._properties = promise.then(function(dev){ return dev.properties;});
        }

    }
);
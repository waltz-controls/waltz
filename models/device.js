Device = MVC.Model.extend("device",
    /*@Static */
    {
        id: 'url',
        fetch:function(inst){
            //TODO fail
            return webix.ajax().get(inst.url).then(function(resp) {
                var device = resp.json();
                return device;
            });
        }
    },
    /*@Prototype */
    {
        //properties reference to promise objects
        _info:null,
        _commands:null,
        _attributes:null,
        /**
         *
         * @constructor
         * @param attrs
         */
        /**
         *
         * @return promise
         */
        info:function(){
            if(this._info == null){
                return this._info = this.Class.fetch(this).then(function(dev){
                    return dev.info;
                });
            }
            return this._info;
        },
        /**
         *
         * @return promise
         */
        commands:function(){
            if(this._commands == null){
                return this._commands =this.Class.fetch(this).then(function(dev){
                    return dev.commands;
                });
            }
            return this._commands;
        },
        /**
         *
         * @return promise
         */
        attributes:function(){
            if(this._attributes == null){
                return this._attributes = this.Class.fetch(this).then(function(dev){
                    return dev.attributes;
                });
            }
            return this._attributes;
        },
        update:function(){
            this.Class.fetch(this);
        }

    }
);
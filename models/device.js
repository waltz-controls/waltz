Device = MVC.Model.extend("device",
    /*@Static */
    {
        fetch:function(inst){
            return webix.ajax().get(inst.id)
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
                return this.Class.fetch(this).then(function(inst){
                    return this;
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
                return this.Class.fetch(this)._commands;
            }
            return this._commands;
        },
        /**
         *
         * @return promise
         */
        attributes:function(){
            if(this._attributes == null){
                return this.Class.fetch(this)._attributes;
            }
            return _attributes;
        }

    }
);
Device = MVC.Model.extend("device",
    /*@Static */
    {
        fetch:function(inst){
            return inst.api.devices(inst.name).get();
        }
    },
    /*@Prototype */
    {
        /**
         * An unique id, usually it is dbId followed by this device's name, e.g. 123456/sys/tg_test/1
         */
        id: null,
        api: null,
        attributesCollection: null,
        attributeInfoCollection: null,
        commandsCollection: null,
        pipesCollection: null,
        _db: null,
        _attrIds: null,
        //properties reference to promise objects
        _admin:null,
        _attributesInfo: null,
        /**
         *
         * @constructor
         * @param name
         * @param dbId -- database uid
         * @param api -- tango rest api
         */
        init: function(name, dbId, api){
            this._super({name:name, id: dbId + '/' + name});
            this.api = api;

            this.attributeInfoCollection = new webix.DataCollection();
            this._attrIds = {};
        },
        /**
         *
         * @returns {Promise}
         */
        promiseAdmin:function(){
            return this._admin ? this._admin : this.info().then(function(api, info){
                return new DServer(info.server, api);
            }.bind(this, this.api));
        },
        /**
         *
         * @return {Promise}
         */
        info:function(){
            return this.api.devices(this.name).get().then(function(dev){return dev.info;});
        },
        /**
         *
         * @return {Promise}
         */
        commands:function(){
            return this.api.devices(this.name).commands().get();
        },
        /**
         *
         * @param name
         * @return {Promise}
         */
        commandInfo: function(name){
            return this.api.devices(this.name).commands(name).get();
        },
        /**
         *
         * @return {Promise}
         */
        attributes:function(){
            return this.api.devices(this.name).attributes().get();
        },
        _updateAttributeInfos:function(infos){
            for(var i = 0 ; i<infos.length; ++i){
                var info = infos[i];
                if(this._attrIds.hasOwnProperty(info.name)){
                    this.attributeInfoCollection.updateItem(this._attrIds[info.name], info);
                } else {
                    this._attrIds[info.name] = this.attributeInfoCollection.add(info);
                }
            }
            return infos;
        },
        /**
         *
         * @param attr -- attr name or undefined
         * @return {Promise}
         */
        attributeInfo:function(attr){
            var promise = this.api.devices(this.name).attributes(attr).get('/info');

            return promise.then(function(info){ return [info];}).then(this._updateAttributeInfos.bind(this));
        },
        attributesInfo: function(){
            return this.attributes().then(function(attrs){
                return attrs.map(function(attr){ return attr.name;});
            }).then(function(attrs){
                return this.api.devices(this.name).attributes().get('/info?' + attrs.map(function(attr){ return "attr=" + attr;}).join('&'));
            }.bind(this)).then(this._updateAttributeInfos.bind(this));
        },
        /**
         *
         * @returns {Promise}
         */
        pipes:function(){
            return this.api.devices(this.name).pipes().get();
        },
        /**
         *
         * @return {Promise}
         */
        properties:function(){
            return this.api.devices(this.name).get("/properties");
        },
        /**
         *
         * @return promise
         */
        state:function(){
            return this.api.devices(this.name).get("/state");
        },
        executeCommand:function(cmd, argin){
            var command = this.api.devices(this.name).commands(cmd);
            if(argin && argin != "")
                return command.exec(argin);
            else
                return command.exec();
        },
        readAttribute:function(attr){
            return this.api.devices(this.name).attributes(attr).get('/value');
        },
        writeAttribute:function(attr, argin){
            return this.api.devices(this.name).attributes(attr).put('?value=' + argin)
        },
        updateAttributeInfo: function(attr){
            if(!this._attrIds.hasOwnProperty(attr)) debugger;
            var id = this._attrIds[attr];
            var info = this.attributeInfoCollection.getItem(id);
            return this.api.devices(this.name).attributes(attr).put('/info?async=true', info)
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

(function () {
    /**
     * Model tango_attribute
     *
     * Extends {@link https://jmvc-15x.github.io/docs/classes/MVC.Model.html MVC.Model}
     * @class
     * @memberof tango
     * @property {string} id - //host_id/device_id/name
     * @property {string} name
     * @property {string} device_id
     * @property {string} display_name
     */
    TangoAttribute = MVC.Model.extend('tango_attribute',
        /** @lends  tango.TangoAttribute */
        {

            attributes: {
                id: 'string',//host_id/device_id/name
                name: 'string',
                device_id: 'string',
                display_name: 'string',
                info: 'object',
                properties: 'object',
                value: 'any',
                timestamp: 'int',
                quality: 'string'
            },
            default_attributes: {},
            /**
             * @param id
             * @return {{tango_host: string, tango_port: number, device: string, name: string}}
             */
            parseId:function(id){
                var parts = id.split('/');

                return {
                    id: id,
                    host:parts[0],
                    device:[parts[1],parts[2], parts[3]].join('/'),
                    name:parts[4]
                }
            }
        },
        /** @lends  tango.TangoAttribute.prototype */
        {
            /**
             * @param attrs
             * @constructs
             */
            init:function(attrs){
                attrs.display_name = attrs.display_name || attrs.name;
                this._super(attrs);
            },
            /**
             * @return {boolean}
             */
            isScalar:function(){
                return this.info.data_format === 'SCALAR';
            },
            _handle_resp : function (resp) {
                var result = resp[0];
                this.update_attributes(result);
                if (!this.valid())
                    throw this;
                else return this;
            },
            /**
             * @returns {webix.promise}
             */
            read: function () {
                var device = PlatformContext.devices.getItem(this.device_id);
                return device.fetchAttrValues([this.name]).then(this._handle_resp.bind(this));
            },
            /**
             * @returns {webix.promise}
             */
            fetchHistory:function(){
                var device = PlatformContext.devices.getItem(this.device_id);
                return device.toTangoRestApiRequest().attributes(this.name).get('/history')
                    .then(function(resp){
                        this.update_attributes({
                            history: resp,
                            timestamp: +new Date()
                        });
                        return this;
                    }.bind(this));
            },
            /**
             *
             * @return {Promise<AttributeInfo>}
             */
            fetchInfo(){
                const device = PlatformContext.devices.getItem(this.device_id);
                return device.toTangoRestApiRequest().attributes(this.name).get('/info')
                    .then((resp) => {
                        this.update_attributes({
                            info: resp
                        });
                        return resp;
                    });
            },
            /**
             * @param value
             * @returns {webix.promise}
             */
            write: function (value) {
                var device = PlatformContext.devices.getItem(this.device_id);

                var values = {};
                values[this.name] = value;
                this.value = value;
                return device.putAttrValues(values);
            },
            /**
             * @returns {*|webix.promise}
             */
            //TODO extract AttributeInfo (aka MVC.Model.JSON) and move this method there
            putInfo: function () {
                var device = PlatformContext.devices.getItem(this.device_id);
                return device.toTangoRestApiRequest().attributes(this.name).put('/info?async=true', this.info);
            },
            /**
             * @returns {'STATE'|'STATUS'|'SCALAR'|'SPECTRUM'|'IMAGE'}
             */
            getDataFormat:function(){
                if(this.name === 'State') return 'STATE';
                if(this.name === 'Status') return 'STATUS';
                return this.info.data_format;
            },
            /**
             *
             * @return {string} fa icon
             */
            getIcon:function(){
                if(this.name === 'State') return 'fa-tachometer';
                if(this.name === 'Status') return 'fa-tachometer';

                switch (this.info.data_format){
                    case "SCALAR":
                        return 'fa-at';
                    case "SPECTRUM":
                        return 'fa-area-chart';
                    case "IMAGE":
                        return 'fa-picture-o';
                }
            }
        }
    );
})();

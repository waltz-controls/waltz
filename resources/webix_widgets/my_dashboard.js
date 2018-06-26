/**
 * @module MyDashboard
 */
(function(){
    //this function is private to this module
    var newPlotWidget=function(){
        return TangoWebapp.ui.newImageView({
            id:'mydashboard.plot',
            gravity: 3
        });
    };

    /**
     * @type {webix.protoUI}
     */
    var my_dashboard = webix.protoUI(
        {
            name: 'my_dashboard',
            /**
             * @return {webix.ui}
             * @private
             */
            _ui:function(){
                return {
                    rows:[
                        {},
                        {
                            gravity: 3,
                            cols:[
                                {},
                                //it is a good idea to move parts of the ui to a dedicated functions
                                newPlotWidget(),
                                {}
                            ]
                        },
                        {}
                    ]
                }
            },
            //NEW CODE HERE!!!
            run:function(){
                //note this.
                this.attr.then(function(attr){
                    return attr.read();
                })
                    .then(function(value){
                        $$('mydashboard.plot').update(value)
                    })
                    .fail(function(err){
                        TangoWebappHelpers.error("Could not read attribute", err);
                    })
            },
            /**
             *
             * @param config
             * @constructor
             */
            $init:function(config){
                //extend client config with this widget's ui
                webix.extend(config, this._ui());
                //add some after construction logic
                this.$ready.push(function(){
                    //NOW STORE attr AS PROPERTY
                    this.attr = PlatformContext.rest.fetchHost('localhost:10000')
                        .then(function(host){
                            return host.fetchDevice('sys/tg_test/1');
                        }).then(function (device) {
                            return device.fetchAttr('double_image_ro')
                        });
                    this.start();
                }.bind(this));//very important to bind function to a proper this object
            }
        }
    , TangoWebappPlatform.mixin.Runnable, webix.ui.layout);

    newMyDashboard = function(config){
        return webix.extend({
            view: 'my_dashboard'
        }, config);
    }
})();
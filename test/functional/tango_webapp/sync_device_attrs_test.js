new Test.Functional('sync_device_attrs',{
    test_simple: function () {
        var protoUI = webix.protoUI({
            name: 'sync_attrs_test',
            _ui:function(){
                return {
                    rows :[
                        {
                            view:'datatable',
                            id: 'monitor',
                            columns: [
                                { id: 'name'},
                                { id: 'description', template:function(obj){
                                        return obj.info.description;
                                    }
                                }
                            ]
                        },
                        {
                            view: 'datatable',
                            id: 'panel',
                            select:true,
                            editable: true,
                            columns:[
                                { id: 'name' },
                                { id: 'value' },
                                { id: 'description', editor: "text", template:function(obj){
                                        return obj.info.description;
                                    }
                                }
                            ],
                            scheme:{
                                $update:function(obj){
                                    obj.info.description = obj.description;
                                    delete obj.description;
                                },
                                $save:function(){
                                    debugger
                                }
                            }
                        },
                        {
                            view: 'list',
                            id: 'list',
                            template:'#name#',
                            select:true

                        },
                        {
                            view: 'form',
                            id: 'form',
                            elements: [
                                { view:"text", label:"name", name: "name"},
                                { view:"text", label:"value", name: "value" },
                                { view:"button", type:"form", label:"safe", click:function(){
                                    this.getFormView().save();
                                    } }
                            ]
                        }
                    ]
                };
            },
            $init: function(config){
                webix.extend(config, this._ui());
                this.$ready.push(function(){
                    this.$$('monitor').data.sync(config.attrs);
                    this.$$('panel').data.sync(config.attrs);
                    this.$$('list').data.sync(config.attrs);

                    this.$$('form').bind(config.attrs);
                    this.$$('list').attachEvent("onAfterSelect", function(id){  config.attrs.setCursor(id); });
                    this.$$('panel').attachEvent("onAfterSelect", function(id){
                        this.$$('list').select(id);
                    }.bind(this));
                }.bind(this));
            }
        }, webix.IdSpace, webix.ui.layout);

        PlatformContext.rest.fetchHost(TestValues.tango_host)
            .then(function (host) {
                return host.fetchDevice(TestValues.test_device);
            })
            .then(function (device) {
                return device.fetchAttrs();
            })
            .then(function(attrs){
                debugger
                var data = new webix.DataCollection({
                    data: attrs
                });
                webix.ui(
                    {
                        view: 'window',
                        id: 'monitor_window',
                        move: true,
                        fullscreen: true,
                        body: {
                            view: "sync_attrs_test",
                            id: 'test/monitor/' + TestValues.test_device,
                            attrs: data
                        }
                    }
                    ).show();

                var counter = 0;
                setInterval(function () {
                    data.updateItem('localhost:10000/sys/tg_test/1/ampli', {
                        value: Math.random()
                    });
                    data.updateItem('localhost:10000/sys/tg_test/1/long_scalar', {
                        value: ++counter
                    });
                },1000);

                setInterval(function () {
                    var data = new webix.DataCollection({
                        data: [
                            {
                                name: 'something else'
                            }
                        ]
                    });


                    $$('test/monitor/sys/tg_test/1').$$('list').data.sync(data);
                },30000);
            }).then(this.next_callback('check_open'))
            .fail(function (e) {
                console.error(e);
                throw e;
            });


    },
    check_open: function () {
        this.assert($$('monitor_window').isVisible());
    },
    test_close: function () {
        $$('monitor_window').close();
    }
});
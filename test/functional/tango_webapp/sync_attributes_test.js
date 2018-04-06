new MVC.Test.Functional('sync_attributes', {
    test_simple: function () {
        var attrs = new webix.DataCollection({
            data: [
                new TangoAttribute({
                    id: '1',
                    name: 'attr 1',
                    device_id: '1'
                }),
                new TangoAttribute({
                    id: '2',
                    name: 'attr 2',
                    device_id: '1'
                }),
                new TangoAttribute({
                    id: '3',
                    name: 'attr 3',
                    device_id: '2'
                }),
                new TangoAttribute({
                    id: '4',
                    name: 'attr 4',
                    device_id: '3'
                })
            ]
        });

        function Device(id) {
            this.id = id;
            this.attrs = new webix.DataCollection();
        }

        var device1 = new Device("1");
        var device2 = new Device("2");
        var device3 = new Device("3");

        device1.attrs.data.sync(attrs, function() {
            this.filter(function (data) {
                return data.device_id === device1.id;
            });
        });

        device2.attrs.data.sync(attrs, function() {
            this.filter(function (data) {
                return data.device_id === device2.id;
            });
        });

        device3.attrs.data.sync(attrs, function() {
            this.filter(function (data) {
                return data.device_id === device3.id;
            });
        });

        var window = webix.ui({
            view: 'window',
            id: 'sync_attrs_window',
            move: true,
            fullscreen: true,
            body: {
                rows: [{
                    view: 'datatable',
                    id: 'attrs',
                    editable: true,
                    columns:[
                        {id: 'id'},
                        {id: 'name', editor: 'text'},
                        {id: 'device_id'}
                    ]
                },
                    {
                        view: 'datatable',
                        id: 'device1',
                        select:true,
                        data: device1.attrs,
                        editable: true,
                        columns:[
                            { id: 'id' },
                            { id: 'name', editor: 'text'}
                        ]
                    },
                    {
                        view: 'datatable',
                        id: 'device2',
                        data: device2.attrs,
                        select:true,
                        editable: true,
                        columns:[
                            { id: 'id' },
                            { id: 'name', editor: 'text'}
                        ]
                    },
                    {
                        view: 'datatable',
                        id: 'device3',
                        select:true,
                        editable: true,
                        data: device3.attrs,
                        columns:[
                            { id: 'id' },
                            { id: 'name', editor: 'text'}
                        ]
                    }
                ]
            }

        });


        $$('attrs').data.sync(attrs);
        // $$('device1').data.sync(device1.attrs);
        // $$('device2').data.sync(device2.attrs);
        // $$('device3').data.sync(device3.attrs);
        
        window.show();
    },
    test_close_simple: function(){
        $$('sync_attrs_window').destructor();
    },
    _complex:function(max){
        var data = [];

        for(var i = 0;i < max; i++){
            data.push(new TangoAttribute({
                id: i,
                name: 'attr_' + webix.uid(),
                device_id: Math.floor(Math.random() * (5))
            }))
        }

        var attrs = new webix.DataCollection({
            data: data
        });

        function Device(id) {
            this.id = id;
            this.attrs = new webix.DataCollection();
            this.attrs.sync(attrs,function(){
                this.filter(function (data) {
                    return data.device_id === id;
                });
            })
        }

        var devices = new webix.DataCollection({
            data: [
                new Device(1),
                new Device(2),
                new Device(3),
                new Device(4)
            ]
        });
        var device1 = devices.getItem(1);
        var device2 = devices.getItem(2);
        var device3 = devices.getItem(3);
        var device4 = devices.getItem(4);

        var window = webix.ui({
            view: 'window',
            id: 'sync_complex_attrs_window',
            move: true,
            fullscreen: true,
            body: {
                rows: [{
                    view: 'datatable',
                    id: 'attrs',
                    select:true,
                    editable: true,
                    columns:[
                        {id: 'id'},
                        {id: 'name', editor: 'text'},
                        {id: 'device_id'}
                    ]
                },
                    {
                        view: 'datatable',
                        id: 'device1',
                        select:true,
                        data: device1.attrs,
                        editable: true,
                        columns:[
                            { id: 'id' },
                            { id: 'name', editor: 'text'}
                        ]
                    },
                    {
                        view: 'datatable',
                        id: 'device2',
                        data: device2.attrs,
                        select:true,
                        editable: true,
                        columns:[
                            { id: 'id' },
                            { id: 'name', editor: 'text'}
                        ]
                    },
                    {
                        view: 'datatable',
                        id: 'device3',
                        select:true,
                        editable: true,
                        data: device3.attrs,
                        columns:[
                            { id: 'id' },
                            { id: 'name', editor: 'text'}
                        ]
                    },
                    {
                        view: 'datatable',
                        id: 'device4',
                        select:true,
                        editable: true,
                        data: device4.attrs,
                        columns:[
                            { id: 'id' },
                            { id: 'name', editor: 'text'}
                        ]
                    },
                    {
                        view: 'list',
                        id: 'list',
                        template:'#name#',
                        select:true,
                        device_id: undefined
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
            }

        });


        $$('attrs').data.sync(attrs);
        $$('device1').attachEvent("onAfterSelect", function(id){
            $$('attrs').select(id);
            devices.setCursor(1);
        });
        $$('device2').attachEvent("onAfterSelect", function(id){
            $$('attrs').select(id);
            devices.setCursor(2);
        });
        $$('device3').attachEvent("onAfterSelect", function(id){
            $$('attrs').select(id);
            devices.setCursor(3);
        });
        $$('device4').attachEvent("onAfterSelect", function(id){
            $$('attrs').select(id);
            devices.setCursor(4);
        });



        $$('list').bind(devices);
        $$('list').attachEvent("onBindApply",function(obj){
            if(!obj || this.device_id === obj.id) return;
            this.device_id = obj.id;
            this.data.sync(obj.attrs);
            console.log("onBindApply");
        });


        $$('form').bind($$('list'));

        window.show();
    },
    test_complex_10K: function () {
        this._complex(10000);
    },
    test_close_complex_10K: function(){
        $$('sync_complex_attrs_window').destructor();
    },
    test_complex_100K: function () {
        this._complex(100000);
    },
    test_close_complex_100K: function(){
        $$('sync_complex_attrs_window').destructor();
    },
    test_complex_1M: function () {
        this._complex(1000000);
    },
    test_close_complex_1M: function(){
        $$('sync_complex_attrs_window').destructor();
    }

});



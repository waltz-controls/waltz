/** @module TestDevicePanel */
(function () {
    var test_device_panel = webix.protoUI({
        name: 'test_device_panel',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'clean',
                        id: 'device',
                        height: 30,
                        //TODO align center
                        template: 'Device[<span class="webix_strong">#name#</span>]'
                    },
                    {
                        template: 'body'
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.disable();
                this.$$('device').bind(config.context.devices);
            }.bind(this));
        },
        defaults: {
            on: {}
        }
    }, webix.IdSpace, webix.ui.layout)
})();
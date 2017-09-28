/** @module TestDevicePanel */
(function () {
    var test_device_panel = webix.protoUI({
        name: 'test_device_panel',
        _ui: function () {
            return {
                rows: [
                    {
                        type: 'header',
                        height: 30,
                        template: '<span class="webix_strong">#name#</span>',
                        data: {name: 'Device has not been selected'}
                    },
                    {
                        template: 'body'
                    }
                ]
            };
        },
        $init: function (config) {
            webix.extend(config, this._ui())
        }

    }, webix.IdSpace, webix.ui.layout)
})();
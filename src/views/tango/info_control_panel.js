/**
 * More info: {@link https://docs.webix.com/api__refs__ui.view.html webix.ui.view}
 * @augments webix.ui.view
 * @memberof ui.DeviceViewPanel
 * @name info_panel_empty
 * @type {protoUI}
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
const info_panel_empty = webix.protoUI({
    name:"info_panel_empty",
    $init:function(){
    }
},  webix.ProgressBar, webix.ui.view);

/**
 * See {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 *
 * @augments webix.ui.layout
 * @memberof ui.DeviceViewPanel
 * @name info_control_panel
 * @type {protoUI}
 * @property {DevicePanelCommands} commands
 * @property {DevicePanelAttributes} attrs
 * @property {DevicePanelPipes} pipes
 * @see {@link https://docs.webix.com/api__refs__ui.layout.html webix.ui.layout}
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
const info_control_panel = webix.protoUI(
    {
        name: 'info_control_panel',
        /**
         * @memberof ui.DeviceControlPanel
         * @inner
         */
        clearAll: function () {
            //TODO
            this.$$('commands').clearAll();
            this.$$('attrs').clearAll();
            this.$$('pipes').clearAll();
        },
        get host(){
            return this.$$('tango_host');
        },
        _ui: function (context) {
            return {
                rows: [
                    {
                        view: "multiview",
                        gravity: 3,
                        cells: [
                            {
                                view: 'info_panel_empty'
                            },
                            {
                                template: 'device_info_panel',
                                id: 'device',
                                context: context
                            },
                            {
                                template: 'command_info_panel',
                                id: 'commands',
                                context: context
                            },
                            {
                                template: 'attr_info_panel',
                                id: 'attrs',
                                context: context
                            },
                            {
                                template: 'pipe_info_panel',
                                id: 'pipes',
                                context: context
                            }
                        ]
                    }
                ]
            };
        },
        _update_header:function(data){
            $$("info_control_panel_header").config.header = webix.template(function () {
                switch(data.kind){
                    case "tango_host":
                        return `<span class='webix_icon ${TangoHost.find_one(data.id).getIcon()}'></span> Tango host: ${TangoHost.find_one(data.id).display_name}`;
                    case "device":
                        return `<span class='webix_icon ${TangoDevice.find_one(data.id).getIcon()}'></span> Device: ${TangoDevice.find_one(data.id).display_name}`;
                    case "commands":
                        return `<span class='webix_icon ${TangoCommand.find_one(data.id).getIcon()}'></span> Command: ${TangoCommand.find_one(data.id).display_name}`;
                    case "attrs":
                        return `<span class='webix_icon ${TangoAttribute.find_one(data.id).getIcon()}'></span> Attr: ${TangoAttribute.find_one(data.id).display_name}`;
                    case "pipes":
                        return `<span class='webix_icon ${TangoPipe.find_one(data.id).getIcon()}'></span> Pipe: ${TangoPipe.find_one(data.id).display_name}`;
                    default:
                        throw new Error(`Unknown selected kind=${data.kind}`);
                }

            });
            $$("info_control_panel_header").refresh();
        },
        /**
         * @constructs
         * @memberof ui.DeviceViewPanel.DeviceControlPanel
         */
        $init: function (config) {
            webix.extend(config, this._ui(config));
        },
        defaults: {
            on: {
                /**
                 * @listens event:item_selected
                 * @function
                 * @memberof ui.DeviceViewPanel.DeviceControlPanel.prototype
                 * @inner
                 */
                "tango_webapp.item_selected subscribe":function(event){
                    var $$view = this.$$(event.data.kind);
                    if($$view === undefined) return;
                    this._update_header(event.data);
                    $$view.show(true);

                    switch (event.data.kind){
                        case "commands":
                            $$view.setCommand(TangoCommand.find_one(event.data.id));
                            break;
                        case "attrs":
                            $$view.setAttribute(TangoAttribute.find_one(event.data.id));
                            break;
                        case "pipes":
                            $$view.setPipe(TangoPipe.find_one(event.data.id));
                            break;
                    }
                }
            }
        }
    }, webix.IdSpace, webix.ui.layout);
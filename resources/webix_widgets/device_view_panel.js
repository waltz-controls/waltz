/**
 * This module contains two panels related to tango device: info panel and control panel.
 *
 * Info panel is responsible for displaying device's info as datatable and commands, attributes and pipes as lists
 *
 * Control panel executes commands; reads, writes attributes and pipes
 *
 * @module DeviceViewPanel
 * @memberof ui
 */
import newSearch from "./search.js";

(function(){
    /**
     * @constant
     * @type {string}
     * @memberof ui.DeviceViewPanel
     */
    const kDevicePanelHeader = "<span class='webix_icon fa-keyboard-o'></span> Device: ";

    /**
     * More info: {@link https://docs.webix.com/api__refs__ui.list.html webix.ui.list}
     * @augments webix.ui.list
     * @name DeviceTreeList
     * @type {protoUI}
     * @memberof ui.DeviceViewPanel
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var DeviceTreeList = webix.protoUI(
        {
            name: 'device_tree_list',
            $init:function(config){
            },
            defaults: {
                select: true,
                drag: "source",
                template: function(obj){
                    return "<span class='webix_icon "+ obj.getIcon() + "'></span>"+ obj.display_name;
                },
                on: {
                    onItemClick(id){
                        if(this.getSelectedId() === id)
                            this.callEvent("onAfterSelect",[id]);
                        return true;
                    },
                    /**
                     *
                     * @param device
                     * @return {boolean}
                     * @memberof ui.DeviceViewPanel.DeviceTreeList
                     */
                    onBindApply: function (device) {
                        if (device.id === undefined) return false;
                        this.clearAll();
                        $$("device_tree").config.header = webix.template(function () {
                            return kDevicePanelHeader + device.display_name;
                        });
                        $$("device_tree").refresh();
                        this.showProgress({
                            type: 'icon'
                        });
                        device["fetch" + MVC.String.classize(this.config.$id)]()
                            .fail(function(err){
                                if(err.errors && err.errors[0].reason === 'TangoApi_NOT_SUPPORTED') return [];
                                else throw err;
                            })
                            .then(function () {
                            return device;
                        })
                            .then(function(device){
                                this.data.importData(device[this.config.$id]);
                                this.sort("#display_name#", "asc", "string");
                                this.hideProgress();
                            }.bind(this));
                    },
                    /**
                     * Fires {@link event:item_selected}
                     *
                     * @fires item_selected
                     * @param {string} id
                     * @memberof ui.DeviceViewPanel.DeviceTreeList
                     */
                    onAfterSelect: function (id) {
                        /**
                         * @event tango_webapp.item_selected
                         * @type {OpenAjax}
                         * @property {{id:string,kind:string}} data
                         * @memberof ui
                         */
                        OpenAjax.hub.publish("tango_webapp.item_selected", {
                            data: {
                                id: id,
                                kind: this.config.$id
                            }
                        });
                    },
                    /**
                     * Expands DeviceControlPanel
                     *
                     * @param id
                     * @memberof ui.DeviceViewPanel.DeviceTreeList
                     */
                    onItemDblClick:function(id){
                        const item = this.getItem(id);

                        if(item.Class.className === 'tango_attribute') {
                            const attr = item;
                            if (attr.info.data_format === "SPECTRUM") {
                                UserAction.readAttribute(attr)
                                    .then(openSpectrumWindow.bind(attr));
                            } else if (attr.info.data_format === "IMAGE") {
                                UserAction.readAttribute(attr)
                                    .then(openImageWindow.bind(attr));
                            } else if (attr.info.data_format === "SCALAR") {
                                UserAction.readAttribute(attr)
                                    .then(openScalarWindow.bind(attr));
                            } else {
                                TangoWebappHelpers.error("Unsupported data format: " + this.attr.info.data_format);
                            }
                        } else if(item.Class.className === 'tango_command'){
                            const cmd = item;
                            openCommandWindow(cmd);
                        } else if(item.Class.className === 'tango_pipe'){
                            const pipe = item;
                            UserAction.readPipe(pipe)
                                .then(openPipeWindow.bind(pipe));
                        }

                        $$('info_control_panel_header').expand()
                    },
                    "left_panel_toolbar.click.refresh subscribe"(){
                        if(this.isVisible())
                            PlatformContext.devices.refreshCursor();
                    }
                }
            }
        }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.ui.list);

    /**
     * See {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.layout}
     * 
     * @augments webix.ui.layout
     * @memberof ui.DeviceViewPanel
     * @name device_info_panel
     * @type {protoUI}
     * @property {info_datatable} info
     * @property {DeviceTreeList} commands
     * @property {DeviceTreeList} attrs
     * @property {DeviceTreeList} pipes
     * @see {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.layout}
     *
     * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
     * @since 9/10/18
     */
    var device_view_panel = webix.protoUI({
        name: 'device_view_panel',
        $init:function(config){
            this.$ready.push(function(){
                this.$$('commands').bind(config.context.devices);
                this.$$('attrs').bind(config.context.devices);
                this.$$('pipes').bind(config.context.devices);
            }.bind(this));
        }
    }, webix.IdSpace, webix.ui.tabview);




    function getHeader(device){
        return `<span class='webix_icon ${this.getIcon()}'></span>[<span class='webix_strong'>${device.display_name}/${this.display_name}</span>]`;
    }


    //TODO make instance functions
    function openTab(view, resp) {
            let $$tab = $$(this.id);
            if (!$$tab || !$$tab.isVisible()) {
                const device = PlatformContext.devices.getItem(this.device_id);
                PlatformApi.PlatformUIController().openTangoHostTab(device.host, view);

                $$tab = $$(this.id);
            }

            $$tab.show();
            $$tab.plot.update(resp);
        }

    //TODO send Open Ajax event and handle it in main_controller
    function openSpectrumWindow(resp) {
        var device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: getHeader.call(this, device),
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newSpectrumView(this)
        }, resp);
    }

    //TODO send Open Ajax event and handle it in main_controller
    function openImageWindow(resp) {
        var device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: getHeader.call(this,device),
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newImageView(webix.extend({id: this.id}, resp))
        }, resp);
    }

    function openScalarWindow(resp) {
        const device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: getHeader.call(this,device),
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newScalarView(webix.extend({id: this.id}, resp))
        }, resp)
    }

    function openPipeWindow(resp) {
        const device = PlatformContext.devices.getItem(this.device_id);
        openTab.bind(this)({
            header: getHeader.call(this,device),
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newPipeView(webix.extend({id: this.id}, resp))
        }, resp)
    }

    function openCommandWindow(cmd) {
        var device = PlatformContext.devices.getItem(cmd.device_id);
        openTab.bind(cmd)({
            header: getHeader.call(cmd, device),
            close: true,
            borderless: true,
            body: TangoWebapp.ui.newCommandView(cmd)
        }, undefined)
    }

    /**
     * Factory function for {@link DeviceViewPanel}
     *
     * @param context
     * @return {DeviceViewPanel}
     * @memberof ui.DeviceViewPanel
     */
    TangoWebapp.ui.newDeviceViewPanel = function(context){
        return {
            header: kDevicePanelHeader,
            id: 'device_tree',
            body: {
                context: context,
                id: 'device_view_panel',
                view: 'device_view_panel',
                cells: [
                    {
                        header: "Commands",
                        body: {
                            rows: [
                                newSearch("commands", "#name#"),
                                {
                                    id: 'commands',
                                    view: 'device_tree_list'
                                }
                            ]
                        }
                    },
                    {
                        header: "Attributes",
                        body: {
                            rows: [
                                newSearch("attrs", "#name#"),
                                {
                                    id: 'attrs',
                                    view: 'device_tree_list'
                                }
                            ]
                        }
                    },
                    {
                        header: "Pipes",
                        body: {
                            rows: [
                                newSearch("pipes", "#name#"),
                                {
                                    id: 'pipes',
                                    view: 'device_tree_list'
                                }
                            ]
                        }
                    }
                ]
            }
        }
    };



})();

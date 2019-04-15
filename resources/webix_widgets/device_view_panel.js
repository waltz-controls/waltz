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
import {newComplexSearch} from "./search.js";
import {openCommandWindow,openPipeWindow, openScalarWindow, openSpectrumWindow, openImageWindow} from "./device_controls.js";

/**
 * @constant
 * @type {string}
 * @memberof ui.DeviceViewPanel
 */
const kDevicePanelHeader = "<span class='webix_icon fa-keyboard-o'></span> Device: ";

/**
 * More info: {@link https://docs.webix.com/api__refs__ui.list.html webix.ui.list}
 * @augments webix.ui.list
 * @name device_tree_list
 * @type {protoUI}
 * @memberof ui.DeviceViewPanel
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
const device_tree_list = webix.protoUI(
    {
        name: 'device_tree_list',
        $init: function (config) {
        },
        defaults: {
            select: true,
            drag: "source",
            template: function (obj) {
                return "<span class='webix_icon " + obj.getIcon() + "'></span>" + obj.display_name;
            },
            on: {
                onItemClick(id) {
                    if (this.getSelectedId() === id)
                        this.callEvent("onAfterSelect", [id]);
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

                    this.showProgress({
                        type: 'icon'
                    });
                    device["fetch" + MVC.String.classize(this.config.$id)]()
                        .fail(function (err) {
                            if (err.errors && err.errors[0].reason === 'TangoApi_NOT_SUPPORTED') return [];
                            else throw err;
                        })
                        .then(function () {
                            return device;
                        })
                        .then(function (device) {
                            this.data.importData(device[this.config.$id]);
                            this.sort("#display_name#", "asc", "string");
                            this.define("yCount", Math.min(10, this.count()));
                            this.refresh();
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
                onItemDblClick: function (id) {
                    const item = this.getItem(id);

                    if (item.Class.className === 'tango_attribute') {
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
                    } else if (item.Class.className === 'tango_command') {
                        const cmd = item;
                        openCommandWindow(cmd);
                    } else if (item.Class.className === 'tango_pipe') {
                        const pipe = item;
                        UserAction.readPipe(pipe)
                            .then(openPipeWindow.bind(pipe));
                    }

                    $$('info_control_panel_header').expand()
                },
                "left_panel_toolbar.click.refresh subscribe"() {
                    if (this.isVisible())
                        PlatformContext.devices.refreshCursor();
                }
            }
        }
    }, TangoWebappPlatform.mixin.OpenAjaxListener, webix.ProgressBar, webix.ui.list);


function filter() {
    const value = this.getValue();

    let cmd_filter = value;
    let attr_filter = value;
    let pipe_filter = value;
    if (value.startsWith("cmd:"))
        cmd_filter = value.substring(4);
    if (value.startsWith("attr:"))
        attr_filter = value.substring(5);
    if (value.startsWith("pipe:"))
        pipe_filter = value.substring(5);

    this.getTopParentView().$$("commands").filter("#name#", cmd_filter);
    this.getTopParentView().$$("attrs").filter("#name#", attr_filter);
    this.getTopParentView().$$("pipes").filter("#name#", pipe_filter);
}



const device_control_panel = webix.protoUI({
    name:"device_control_panel",
    _ui(){
        return {
            cells:[
                {id:"attr",view:"device_control_attr"},
                {id:"View2", template:"<i>Info about the Form</i>"}
            ]
        }
    },
    _config(){
        return {
            maxHeight: 120
        }
    },
    $init(config){
        webix.extend(config, this._ui());
        webix.extend(config, this._config());
    }
},webix.ui.multiview);

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
const device_view_panel = webix.protoUI({
    name: 'device_view_panel',
    device: null,
    _ui() {
        return {
            rows: [
                newComplexSearch(filter),
                {
                    id: 'commands',
                    view: 'device_tree_list'
                },
                {
                    id: 'attrs',
                    view: 'device_tree_list'
                },
                {
                    id: 'pipes',
                    view: 'device_tree_list',
                    yCount: 1
                },
                {
                    view: 'device_control_attr',
                    id: "device_control_attr"
                },
                {
                    view: "device_control_command",
                    id: "device_control_command"
                },
                {
                    view: "device_control_pipe",
                    id: "device_control_pipe"
                }
            ]
        }
    },
    clearAll(){
        this.$$('device_control_attr').clear();
        this.$$('device_control_command').clear();
        this.$$('device_control_pipe').clear();
    },
    _sync(device){
        this.$$('commands').data.sync(device.commands);
        this.$$('attrs').data.sync(device.attrs);
        this.$$('pipes').data.sync(device.pipes);
    },
    updateHeader(device){
        $$("device_tree").config.header = webix.template(function () {
            return kDevicePanelHeader + device.display_name;
        });
        $$("device_tree").refresh();
    },
    /**
     *
     * @param {TangoDevice} device
     */
    setDevice(device){
        this.clearAll();

        if(!device || device.id === undefined) return;
        this._sync(device);

        this.updateHeader(device);
    },
    $init: function (config) {
        webix.extend(config, this._ui());

        const master = this;
        this.device = new webix.DataRecord({
            on:{
                onBindApply(device){
                    master.setDevice(device);
                }
            }
        });

        this.$ready.push(() => {
            this.device.bind(config.context.devices);
            this.$$('device_control_attr').bind(this.$$('attrs'));
            this.$$('device_control_command').bind(this.$$('commands'));
            this.$$('device_control_pipe').bind(this.$$('pipes'));
        })
    }
}, webix.IdSpace, webix.ui.layout);

/**
 * Factory function for {@link DeviceViewPanel}
 *
 * @param context
 * @return {DeviceViewPanel}
 * @memberof ui.DeviceViewPanel
 */
TangoWebapp.ui.newDeviceViewPanel = function (context) {
    return {
        header: kDevicePanelHeader,
        id: 'device_tree',
        body: {
            context: context,
            id: 'device_view_panel',
            view: 'device_view_panel'
        }
    }
};

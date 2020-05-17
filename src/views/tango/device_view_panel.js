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
import {newComplexSearch} from "@waltz-controls/waltz-webix-extensions";
import {kActionSelectTangoAttribute, kActionSelectTangoCommand, kActionSelectTangoPipe} from "widgets/tango/actions";
import {TangoId} from "@waltz-controls/tango-rest-client";
import {kTangoTypeAttribute, kTangoTypeCommand, kTangoTypePipe} from "@waltz-controls/waltz-tango-rest-plugin";

function getTangoAction(type){
    switch (type) {
        case kTangoTypeAttribute:
            return kActionSelectTangoAttribute;
        case kTangoTypeCommand:
            return kActionSelectTangoCommand;
        case kTangoTypePipe:
            return kActionSelectTangoPipe;
    }
}

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
        attachCtrlPanel(panel){
            this.panel = panel;
        },
        showCtrlPanel(){
            this.panel.show();
        },
        hideCtrlPanel(){
            this.panel.hide();
        },
        $init: function (config) {
        },
        defaults: {
            drag: "source",
            template: function (obj) {
                return `<span class='webix_list_icon mdi mdi-${obj.icon}'></span>${obj.name}`;
            },
            on: {
                onItemClick(id) {
                    if(this.isSelected(id) && this.panel.isVisible()){
                        this.unselectAll();
                    } else if(this.isSelected(id) && !this.panel.isVisible()) {
                        this.showCtrlPanel();
                    } else {
                        this.select(id);
                    }
                },
                /**
                 * Fires {@link event:item_selected}
                 *
                 * @fires item_selected
                 * @param {string} id
                 * @memberof ui.DeviceViewPanel.DeviceTreeList
                 */
                onAfterSelect (id) {
                    this.config.root.dispatch(TangoId.fromMemberId(id), getTangoAction(this.getItem(id).type))
                },
                onSelectChange (ids) {
                    const id = Array.isArray(ids) ? ids[0]: ids;
                    if(this.isSelected(id)){
                        this.showCtrlPanel();
                    } else {
                        this.hideCtrlPanel();
                    }
                }
            }
        }
    }, webix.ui.list);


function filter() {
    const value = this.getValue();

    let cmd_filter = value;
    let attr_filter = value;
    let pipe_filter = value;
    if (value.startsWith("c:"))
        cmd_filter = value.substring(2);
    if (value.startsWith("a:"))
        attr_filter = value.substring(2);
    if (value.startsWith("p:"))
        pipe_filter = value.substring(2);

    const $$commands = this.getTopParentView().$$("commands");
    const $$attrs = this.getTopParentView().$$("attrs");
    const $$pipes = this.getTopParentView().$$("pipes");

    $$commands.filter("#name#", cmd_filter);
    $$attrs.filter("#name#", attr_filter);
    $$pipes.filter("#name#", pipe_filter);

    if($$commands.count() === 0) $$commands.hide();
    else $$commands.show();
    if($$attrs.count() === 0) $$attrs.hide();
    else $$attrs.show();
    if($$pipes.count() === 0) $$pipes.hide();
    else $$pipes.show();

    if($$commands.count() + $$attrs.count() + $$pipes.count() === 0)
        this.getTopParentView().$$('dummy').show();
    else
        this.getTopParentView().$$('dummy').hide();
}

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
    ui(config) {
        return {
            rows: [
                newComplexSearch(filter, ["a:", "c:", "p:"]),
                {
                    gravity: 4,
                    rows:[
                        {
                            ...config,
                            gravity: 2,
                        id: 'attrs',
                        view: 'device_tree_list',

                    },
                        {
                            ...config,
                            hidden: true,
                            view: 'device_control_attr',
                            id: "device_control_attribute",
                        },
                        {
                            ...config,
                            gravity: 2,
                            id: 'commands',
                            view: 'device_tree_list'
                        },
                        {
                            ...config,
                            hidden: true,
                            view: "device_control_command",
                            id: "device_control_command"
                        },
                        {
                            ...config,
                            id: 'pipes',
                            view: 'device_tree_list',
                            autoheight:true
                        },
                        {
                            ...config,
                            hidden: true,
                            view: "device_control_pipe",
                            id: "device_control_pipe"
                        },
                        {
                            id:"dummy",
                            hidden: true
                        }
                    ]
                },
                {
                    view:"toolbar",
                    borderless: true,
                    cols:[
                        {
                            view: 'icon',
                            icon:'mdi mdi-refresh',
                            click(){
                                config.root.refresh();
                            }
                        }
                    ]
                }
            ]
        }
    },
    $init: function (config) {
        webix.extend(config, this.ui(config));

        this.$ready.push(() => {
            this.$$('device_control_attribute').bind(this.$$('attrs'));
            this.$$('device_control_command').bind(this.$$('commands'));
            this.$$('device_control_pipe').bind(this.$$('pipes'));

            this.$$('attrs').attachCtrlPanel(this.$$('device_control_attribute'));
            this.$$('commands').attachCtrlPanel(this.$$('device_control_command'));
            this.$$('pipes').attachCtrlPanel(this.$$('device_control_pipe'));
        })
    }
}, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

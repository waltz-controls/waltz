import React from "react";
import ReactDOM from "react-dom";

import {TangoDropTarget, Runnable, newToolbar} from "@waltz-controls/waltz-webix-extensions";


const grid_widget = webix.protoUI({
    name: 'grid_widget',

    defaults:{
        borderless:true
    },

    addDevice(device) {
      this.config.api.setDevice(device);
    },

    $init(config){
        this.$ready.push(() => {
          ReactDOM.render(
              <config.GridWidget/>,
          this.getNode())
      })
        this.$ready.push(() => {
            config.root.restoreState()
        })
    }
}, TangoDropTarget, webix.ui.view);

const grid_widget_layout = webix.protoUI({
    name: 'grid_widget_layout',
    run(){
        this.config.root.run();
    },
    ui(config){
        const {GridWidget, root, api} = config;
        return {
            rows:[
                {
                    id: 'grid_widget',
                    view: 'grid_widget',
                    root,
                    GridWidget,
                    api
                },
                newToolbar({
                    view:'icon',
                    icon:'mdi mdi-content-save',
                    click(){
                        config.root.saveState()
                    }
                })
            ]
        }
    },
    $init(config){
        webix.extend(config, this.ui(config))
    }
},Runnable,webix.IdSpace,webix.ui.layout);

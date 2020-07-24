import {GridWidget, gridSlice, gridStore} from "@waltz-controls/waltz-grid-widget";
import React from "react";
import ReactDOM from "react-dom";

import {TangoDropTarget} from "@waltz-controls/waltz-webix-extensions";


const grid_widget = webix.protoUI({
    name: 'grid_widget',

    defaults:{
        borderless:true
    },

    $init(config){

        const testDevice = {
          host: "localhost:10000",
          device: "test",
          attributes: [
            {
              name: "double_scalar",
              value: 249.43882402802603
            }
          ],
          commands: []
        }
        gridStore.dispatch(gridSlice.actions.setDevice(testDevice))

        this.$ready.push(() => {
            ReactDOM.render(
                <GridWidget/>,
            this.getNode())
        })
    }
}, TangoDropTarget, webix.ui.view);

import {makeGridWidget} from "@waltz-controls/waltz-grid-widget";
import React from "react";
import ReactDOM from "react-dom";

import {TangoDropTarget} from "@waltz-controls/waltz-webix-extensions";


const grid_widget = webix.protoUI({
    name: 'grid_widget',

    defaults:{
        borderless:true
    },

    $init(config){
      
      const testProps = {
          devices: [
            {
              name: {
                host: "localhost:10000",
                device: "test"
              },
              attributes: [
                {
                  name: "double_scalar",
                  value: 249.43882402802603,
                  history: [{
                    time: 0,
                    value: 240
                  },{
                    time: 1,
                    value: 241
                  },{
                    time: 2,
                    value: 242
                  },{
                    time: 3,
                    value: 243
                  },{
                    time: 4,
                    value: 244
                  },],
                }
              ],
              commands: [
                {
                  name: "test_command"
                }
              ]
            }, 
          ],
          config: {
            devices: [
              {
                name: {
                  host: "localhost:10000",
                  device: "test",
                },
                attributes: [
                  {
                    name: "double_scalar",
                    show: true,
                    pollingPeriodS: 5,
                    displayPlot: "1"
                  }
                ],
                commands: [
                  {
                    name: "test_command",
                    show: true
                  }
                ]
              }
            ]
          },
          general: {
            geometry: {
              cols: 2,
              rows: 2
            },
            bgcolor: "#f4f5f9",
            plots: [
              {
                id: "1",
                name: "Test Plot"
              }
            ]
          }
      }

        const {GridWidget, api} = makeGridWidget(console.log)
        api.setState(testProps)

        this.$ready.push(() => {
          ReactDOM.render(
              <GridWidget/>,
          this.getNode())
      })
    }
}, TangoDropTarget, webix.ui.view);

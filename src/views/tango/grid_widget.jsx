import {GridWidget} from "@waltz-controls/waltz-grid-widget";
import React from "react";
import ReactDOM from "react-dom";

import { Provider, useSelector } from 'react-redux'
import {createSlice, createStore} from "@reduxjs/toolkit"
import {TangoDropTarget} from "@waltz-controls/waltz-webix-extensions";

const testDevice = {
    attributes: {
        double_scalar: {
            value: {
                "name": "double_scalar",
                "value": 249.43882402802603,
                "quality": "ATTR_VALID",
                "timestamp": 1593943837231
            },
            info: {
                "name": "ampli",
                "writable": "WRITE",
                "data_format": "SCALAR",
                "data_type": "DevDouble",
                "max_dim_x": 1,
                "max_dim_y": 0,
                "description": "No description",
                "label": "ampli",
                "unit": "",
                "standard_unit": "No standard unit",
                "display_unit": "No display unit",
                "format": "%6.2f",
                "min_value": "Not specified",
                "max_value": "Not specified",
                "min_alarm": "Not specified",
                "max_alarm": "Not specified",
                "writable_attr_name": "None",
                "level": "OPERATOR",
                "extensions": [],
                "alarms": {
                  "min_alarm": "Not specified",
                  "max_alarm": "Not specified",
                  "min_warning": "Not specified",
                  "max_warning": "Not specified",
                  "delta_t": "Not specified",
                  "delta_val": "Not specified",
                  "extensions": [],
                  "tangoObj": {
                    "min_alarm": "Not specified",
                    "max_alarm": "Not specified",
                    "min_warning": "Not specified",
                    "max_warning": "Not specified",
                    "delta_t": "Not specified",
                    "delta_val": "Not specified",
                    "extensions": []
                  }
                },
                "events": {
                  "ch_event": {
                    "rel_change": "Not specified",
                    "abs_change": "Not specified",
                    "extensions": [],
                    "tangoObj": {
                      "rel_change": "Not specified",
                      "abs_change": "Not specified",
                      "extensions": []
                    }
                  },
                  "per_event": {
                    "period": 1000,
                    "extensions": [],
                    "tangoObj": {
                      "period": "1000",
                      "extensions": []
                    }
                  },
                  "arch_event": {
                    "rel_change": "Not specified",
                    "abs_change": "Not specified",
                    "period": "Not specified",
                    "extensions": [],
                    "tangoObj": {
                      "rel_change": "Not specified",
                      "abs_change": "Not specified",
                      "period": "Not specified",
                      "extensions": []
                    }
                  },
                  "tangoObj": {
                    "ch_event": {
                      "rel_change": "Not specified",
                      "abs_change": "Not specified",
                      "extensions": []
                    },
                    "per_event": {
                      "period": "1000",
                      "extensions": []
                    },
                    "arch_event": {
                      "rel_change": "Not specified",
                      "abs_change": "Not specified",
                      "period": "Not specified",
                      "extensions": []
                    }
                  }
                },
                "sys_extensions": [],
                "isMemorized": false,
                "isSetAtInit": true,
                "memorized": "NOT_MEMORIZED",
                "root_attr_name": "Not specified",
                "enum_label": []
              },
              history: [],
              name: "double_scalar",
              properties: {
                  "archive_abs_change": {
                    "name": "archive_abs_change",
                    "values": [
                      "-1",
                      "1"
                    ]
                  },
                  "archive_period": {
                    "name": "archive_period",
                    "values": [
                      "5000"
                    ]
                  },
                  "archive_rel_change": {
                    "name": "archive_rel_change",
                    "values": [
                      "-1",
                      "1"
                    ]
                  }
              }
        }
    },
    commands: {},
    pipes: {},
    properties: {},
    name: "sys/tg_test/1",
    info: {
        last_exported: "5th July 2020 at 10:07:07",
        last_unexported: "29th June 2020 at 18:27:24",
        name: "sys/tg_test/1",
        ior: "IOR:010000001700000049444c3a54616e676f2f4465766963655f353a312e3000000100000000000000ad000000010102000b0000003137322e31392e302e35000089a900000e000000fe4ba6015f00000001000000000000000300000000000000080000000100000000545441010000001c000000010000000100010001000000010001050901010001000000090101000254544141000000010000000d00000032356266363366316465393200000000250000002f746d702f6f6d6e692d74616e676f2f3030303030303030312d3135393339343336323700",
        version: 5,
        exported: true,
        pid: 1,
        server: "TangoTest/test",
        hostname: "25bf63f1de92",
        classname: "unknown",
        is_taco: false
    },
    state: {
        state: "RUNNING",
        status: "The device is in RUNNING state."
    }
}


const grid_widget = webix.protoUI({
    name: 'grid_widget',

    defaults:{
        borderless:true
    },

    
    $init(config){

        const GridRoot = () => {
            const selector = useSelector(state => state)
            return <GridWidget geometry={selector.geometry} devices={selector.devices}></GridWidget>
        }

        const gridSlice = createSlice({
            name: 'GridSlice',
            initialState: {
                geometry: {cols:2, rows: 2},
                devices: [testDevice]
            },
            reducers: {
              addDevice(state, action) {
                state.devices.push(testDevice)
              }
            },
        })
        
        const gridStore = createStore(gridSlice.reducer);
        // gridStore.dispatch(gridSlice.actions.addDevice({}))
        // global.gridStore = gridStore
        // global.gridSlice = gridSlice
        console.log(gridSlice, gridStore);

        this.$ready.push(() => {
            ReactDOM.render(
                <Provider store={gridStore}>
                    <GridRoot></GridRoot>
                </Provider>,
            this.getNode())
        })
    }
}, TangoDropTarget, webix.ui.view);
import GridWidget from "@waltz-controls/waltz-grid-widget";
import React from "react";
import ReactDOM from "react-dom";

const grid_widget = webix.protoUI({
    name: 'grid_widget',
    ui(){
        return {
            rows: [{}]
        }
    },
    $init(config){
        webix.extend(config, this.ui())

        this.$ready.push(() => {
            ReactDOM.render(<GridWidget geometry={config.geometry || {cols:2, rows: 2}} devices={config.devices || []}></GridWidget>, this.getNode())
        })
    }
}, webix.ui.layout);
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
            ReactDOM.render(React.createElement(GridWidget, {geometry:{cols:2, rows: 2}, devices:[]}, null), this.getNode())
        })
    }
}, webix.ui.layout);
const search2 = webix.protoUI({
    name:"search2",
    $cssName:"search",
    $renderIcon:function(){
        const config = this.config;

            const height = config.aheight - 2*config.inputPadding,
                padding = (height - 18)/2 -1;
            let html = "", pos = 2;
            const icons = ["times", "search"];
            for(var i=0; i<icons.length; i++){
                html+="<span style='right:"+pos+"px;height:"
                    +(height-padding)+"px;padding-top:"+padding
                    +"px;' class='webix_input_icon fa-"+icons[i]+"'></span>";

                pos+=24;
            }
            return html;
    },
    on_click:{
        "fa-search":function(e){
            return this.callEvent("onFocus",[e]);
        },
        "fa-times":function(e){
            this.setValue("");
            return this.callEvent("onFocus",[e]);
        }
    },
}, webix.ui.search);

/**
 *
 * @param {string} target
 * @param {string|function} filter
 */
export default function newSearch(target, filter){
    return {
        view: "search2",
        placeholder: "type to filter",
        borderless: true,
        value: "",
        on: {
            onTimedKeyPress: function () {
                this.getTopParentView().$$(target).filter(filter, this.getValue());
            },
            onFocus: function () {
                this.getTopParentView().$$(target).filter(filter, this.getValue());
            }
        }
    }
}

/**
 *
 * @param {function} filter
 */
export function newComplexSearch(filter){
    return {
        view: "search2",
        id:"search",
        placeholder: "type to filter",
        borderless: true,
        value: "",
        on: {
            onTimedKeyPress: filter,
            onFocus: filter
        }
    }
}
webix.protoUI({
    name:"tabbar",
    $setValue:function(value){
        const inputs = this.$view.querySelectorAll(".webix_item_tab");
        let id;

        for (let i=0; i<inputs.length; i++){
            id = inputs[i].getAttribute("button_id");
            const option = this.getOption(id);

            inputs[i].setAttribute("aria-selected", (value==id?"true":"false"));
            inputs[i].setAttribute("tabindex", (option && !option.disabled && value==id?"0":"-1"));
            console.log(inputs[i], value, id)
            if (value == id)
                webix.html.addCss(inputs[i], "webix_selected");
            else
                webix.html.removeCss(inputs[i], "webix_selected");
        }
        const popup = this.config.tabbarPopup;
        if(popup && $$(popup) && $$(popup).getBody().exists(value))
            this.refresh();
    }
}, webix.ui.tabbar);
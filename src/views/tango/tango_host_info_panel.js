const tango_host_info_panel = webix.protoUI({
    name:"tango_host_info_panel",
    defaults:{
        template(obj, $view) {
            if(!obj || !obj.info) return "Please choose TANGO host in the list to view the info";
            return `<span class='webix_strong'>${obj.id}</span>  is alive!
                    <hr/>
                    <div style='display: block'>${obj.info.join('<br/>')}</div>`;
        }
    }
},  webix.ProgressBar, webix.IdSpace, webix.ui.template);
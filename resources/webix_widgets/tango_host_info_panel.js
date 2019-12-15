const tango_host_info_panel = webix.protoUI({
    name:"tango_host_info_panel",
    $init:function(config){
        this.$ready.push(function () {
            this.bind(PlatformContext.tango_hosts)
        }.bind(this));
    },
    defaults:{
        template: function (obj, $view) {
            //TODO see if we can use overlay here
            if (obj.Class === undefined) return "Please choose TANGO host in the list to view the info";
            if (obj.is_alive)
                return "<span class='webix_strong'>" + obj.id + "</span>  is alive!" +
                    "<hr/><div style='display: block'>" + obj.info.join('<br/>') + "</div>";
            else
                return "<span class='webix_icon mdi mdi-emoticon-sad-outline'></span><span class='webix_strong'>" + obj.id + "</span>  is not alive!";
        }
    }
},  webix.ProgressBar, webix.IdSpace, webix.ui.template);
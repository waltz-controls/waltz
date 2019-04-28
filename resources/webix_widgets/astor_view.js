/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 4/28/19
 */
const astor = webix.protoUI({
    name: 'astor',
    get tango_host() {
        return this._tango_host_record.data;
    },
    set tango_host(tango_host) {
        this.$$("template").setValues(tango_host)
    },
    _ui() {
        return {
            rows: [
                {
                    id: "template",
                    template: "#id#"
                }
            ]
        }
    },
    $init(config) {
        webix.extend(config, this._ui());
    },
    defaults: {
        on: {
            "tango_webapp.item_selected subscribe": function (event) {
                if (event.data.kind !== "tango_host") return;
                this.tango_host = TangoHost.find_one(event.data.id);
            }
        }
    }
}, TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);


TangoWebapp.ui.newAstorTab = function (context) {
    return {
        header: "<span class='webix_icon fa-tasks'></span> Astor",
        close: true,
        borderless: true,
        body: {
            view: 'astor',
            id: 'astor',
            context
        }
    }
};


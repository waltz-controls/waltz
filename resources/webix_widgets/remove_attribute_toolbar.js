/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */
const widget_settings = webix.protoUI({
    name: "widget_settings",
    _config() {
        return {
            cols: [{
                name: "editable",
                view: "checkbox",
                label: "Editable",
                labelPosition: "top",
                tooltip: "Enables/disables changes of this table i.e. add/remove attributes etc",
                value: false
            }]
        }
    },
    clear(){
        if(this.getChildViews().length === 1) return;
        do {
            this.removeView(this.getChildViews()[this.getChildViews().length - 1]);
        } while(this.getChildViews().length > 1);
    },
    removeAttribute(name) {
        const readonly = !this.getValues().editable;
        if(readonly) return;
        const col = this.queryView({label: name});
        this.removeView(col);
    },
    addAttribute(label, force) {
        const readonly = !this.getValues().editable;
        if(readonly && !force) return;
        const col = this.queryView({label: label});
        if (col !== null) return;
        this.addView({
            view: "button",
            type: "icon",
            icon: "trash",
            label: label,
            click() {
                this.getTopParentView().removeAttribute(this.data.label);
            }
        });
    },
    addDevice(id) {
        //TODO?
    },
    $init(config) {
        webix.extend(config, this._config());
    }
}, webix.ui.form);

export function newRemoveAttributeSettings() {
    return {
        view: "widget_settings",
        id: "settings"
    };
}

export function toolbar_extension() {
    return [{
        view: "button",
        type: "icon",
        icon: "cog",
        maxWidth: 30,
        tooltip: "Show/hide settings",
        click: function () {
            const $$settings = this.getTopParentView().$$('settings');
            if ($$settings.isVisible())
                $$settings.hide();
            else
                $$settings.show();
        }
    }];
}

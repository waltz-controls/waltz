/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */
const widget_settings = webix.protoUI({
    name: "widget_settings",
    _config() {
        return {
            cols: [{}]
        }
    },
    removeAttribute(name) {
        if(this.getTopParentView().frozen) return;
        const col = this.queryView({label: name});
        this.removeView(col);
        if (this.getChildViews().length === 1) {
            this.getChildViews()[0].define({
                width: 0
            });
            this.getChildViews()[0].resize();
        }
    },
    addAttribute(label, force) {
        if(this.getTopParentView().frozen && !force) return;
        const col = this.queryView({label: label});
        if (col !== null) return;
        this.addView({
            view: "button",
            type: "icon",
            icon: "wxi-trash",
            label: label,
            click() {
                this.getTopParentView().removeAttribute(this.data.label);
            }
        });
        if (this.getChildViews().length === 2) {
            this.getChildViews()[0].define({
                width: 1
            });
            this.getChildViews()[0].resize();
        }
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
        view: "icon",
        icon: "mdi mdi-settings",
        tooltip: "Show/hide settings",
        click: function () {
            this.getTopParentView().toggleSettings();
        }
    }];
}

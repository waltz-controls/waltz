/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */
const settings = webix.protoUI({
    name: "widget_settings",
    _config() {
        return {
            cols: [{}]
        }
    },
    removeAttribute(name) {
        const col = this.queryView({label: name});
        this.removeView(col);
        if (this.getChildViews().length === 1) {
            this.getChildViews()[0].define({
                width: 0
            });
            this.getChildViews()[0].resize();
        }
    },
    addAttribute(label) {
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
        id: "settings",
        hidden: true
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

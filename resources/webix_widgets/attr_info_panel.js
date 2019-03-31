const kAttr_info_values = [
    'label','writable','data_format','data_type','max_dim_x','max_dim_y','unit','standard_unit',
    'display_unit','format','min_value','max_value'];

const kAttr_info_datatable = {
    id: 'info',
    view: 'datatable',
    header:false,
    columns:[
        {id:'info' },
        {id:'value', fillspace: true}
    ],
    on:{
        onBindApply:function(attr){
            if(!attr) return false;
            var info = [];
            info.push({info:'Name', value: attr.name});
            kAttr_info_values.forEach(function(el){
                info.push({info:MVC.String.classize(el), value: attr.info[el]})
            });
            this.clearAll();
            this.parse(info);
        }
    }
};

/**
 * Extends {@link https://docs.webix.com/api__refs__ui.form.html webix.ui.form}
 * @augments webix.ui.form
 * @memberof ui.DeviceViewPanel
 * @name DevicePanelAttributes
 * @type {protoUI}
 * @property {TangoAttribute} attr -- set in TODO method link onBindApply
 * @property {kAttr_info_datatable} info
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
const attr_info_panel = webix.protoUI(
    {
        attr: null,
        name: 'attr_info_panel',
        _ui: function () {
            return {
                rows: [
                    kAttr_info_datatable
                ]
            }
        },
        /**
         *
         * @param {TangoAttribute} attr
         * @memberof ui.DeviceViewPanel.DevicePanelAttributes
         */
        setAttribute:function(attr){
            this.attr = attr;
            var info = [];
            info.push({info:'Name', value: attr.name});
            kAttr_info_values.forEach(function(el){
                info.push({info:MVC.String.classize(el), value: attr.info[el]})
            }.bind(this));
            var $$info = this.$$('info');
            $$info.clearAll();
            $$info.parse(info);
        },
        /**
         * @constructs
         * @memberof ui.DeviceViewPanel.DevicePanelAttributes
         */
        $init: function (config) {
            webix.extend(config, this._ui());

            this.$ready.push(function () {
                this.bind($$('device_view_panel').$$('attrs'));
            }.bind(this));
        },
        defaults: {
            on: {
                /**
                 * Event listener
                 *
                 * @memberof ui.DeviceViewPanel.DevicePanelAttributes
                 */
                onBindApply: function (obj, dummy, master) {
                    if (!obj) return this.clear();
                    this.setAttribute(obj);
                }
            }
        }
    }, webix.ProgressBar, webix.IdSpace, webix.ui.form);

import {StringUtils} from "utils";
import {TangoAttribute} from "@waltz-controls/waltz-tango-rest-plugin";
import {UpdateTangoAttributeInfo} from "models/user_action";
import {newInfoDatatable, newInfoDatatableToolbar, parsePollable, savePolling} from "./info_control_panel";
import {WaltzWidgetMixin} from "@waltz-controls/waltz-webix-extensions";

const kAttr_info_values = [
    'label','writable','data_format','data_type','max_dim_x','max_dim_y','format','description'];

const kAttr_alarms_values = [
    'min_alarm','max_alarm','min_warning','max_warning','delta_t','delta_val'];

/**
 *
 * @param {AttributeInfo} info
 * @return {Array}
 */
function parseInfo(info){
    const result = [];
    result.push({info:'Alias', value: undefined});
    result.push({id:'name',info:'Name', value: info.name});
    kAttr_info_values.forEach(el => result.push({id:el, info:StringUtils.classize(el), value: info[el]}));
    result.push(
        {id:'unit', info:'Unit', value: info.unit, data: [
                {id:'standard_unit', info: "Standard", value: info.standard_unit},
                {id:'display_unit', info: "Display", value: info.display_unit}
            ]});
    result.push(
        {info:'Range', value: "", data: [
                {id:'min_value', info: "MinValue", value: info.min_value},
                {id:'max_value', info: "MaxValue", value: info.max_value}
            ]});

    result.push(
        {info:'Alarms', value: "", data:
                kAttr_alarms_values.map(el => ({id:el, info:StringUtils.classize(el), value: info.alarms[el]}))});
    result.push({info:'Change event', value: "", data:[
                        {id:'ch_event.rel_change', info: "Relative", value: info.events.ch_event.rel_change},
                        {id:'ch_event.abs_change', info: "Absolute", value: info.events.ch_event.abs_change}
                ]});
    result.push({info:'Periodic event', value: "", data:[
                        {id:'per_event.period', info: "Period", value: info.events.per_event.period}
                ]});
    result.push({info:'Archive event', value: "", data:[
                    {id:'arch_event.rel_change', info: "Relative", value: info.events.arch_event.rel_change},
                    {id:'arch_event.abs_change', info: "Absolute", value: info.events.arch_event.abs_change},
                    {id:'arch_event.period', info: "Period", value: info.events.arch_event.period}
                ]});

    return result;
}

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
                borderless: true,
                padding: 0,
                rows: [
                    newInfoDatatable(),
                    newInfoDatatableToolbar()
                ]
            }
        },
        get $$info(){
            return this.$$('info');
        },

        async save(){
            this.showProgress();
            this.$$info.editStop();
            this.$$info.clearValidation();

            const info = this.attr.info;
            //flatten serialized structure
            const items = this.$$info.data.serialize().reduce((acc,val) => {
                acc.push(val);
                if(val.data) return acc.concat(val.data);
                return acc;
            },[]);
            items
                .filter(item => this.attr.info.hasOwnProperty(item.id))
                .forEach(item => info[item.id] = item.value);

            items
                .filter(item => kAttr_alarms_values.includes(item.id))
                .forEach(item => info.alarms[item.id] = item.value);

            //Change event
            info.events.ch_event.rel_change = this.$$info.getItem('ch_event.rel_change').value;
            info.events.ch_event.abs_change = this.$$info.getItem('ch_event.abs_change').value;

            //Periodic event
            info.events.per_event.period = this.$$info.getItem('per_event.period').value;

            //Archive event
            info.events.arch_event.rel_change = this.$$info.getItem('arch_event.rel_change').value;
            info.events.arch_event.abs_change = this.$$info.getItem('arch_event.abs_change').value;
            info.events.arch_event.period = this.$$info.getItem('arch_event.period').value;

            const user = (await this.getUserContext()).user;
            const rest = await this.getTangoRest();

            Promise.all([
                this.getUserActionsController().submit(
                    new UpdateTangoAttributeInfo({user, attribute: this.attr, info})
                ),
                savePolling(this.$$info,rest,this.attr.tango_id)
            ])
            .then(() => this.hideProgress());
        },
        async refresh(){
            this.showProgress();
            const rest = await this.getTangoRest();
            rest.newTangoAttribute(this.attr.tango_id).toTangoRestApiRequest().get().toPromise()
                .then(attribute => this.setAttribute(new TangoAttribute(attribute)))
                .then(() => this.hideProgress());
        },
        /**
         *
         * @param {TangoAttribute} attr
         * @memberof ui.DeviceViewPanel.DevicePanelAttributes
         */
        async setAttribute(attr){
            this.attr = attr;
            const info = parseInfo(attr.info);

            const rest = await this.getTangoRest();
            info.splice(10,0,...(await parsePollable(attr, rest)));

            this.$$info.clearAll();
            this.$$info.parse(info);
        },
        /**
         * @constructs
         * @memberof ui.DeviceViewPanel.DevicePanelAttributes
         */
        $init: function (config) {
            webix.extend(config, this._ui());
        }
    }, WaltzWidgetMixin, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

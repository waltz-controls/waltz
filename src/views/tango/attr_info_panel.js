const kAttr_info_values = [
    'label','writable','data_format','data_type','max_dim_x','max_dim_y','format','description'];

const kAttr_alarms_values = [
    'min_alarm','max_alarm','min_warning','max_warning','delta_t','delta_val'];

export async function parsePollable(pollable) {
    await pollable.fetchPollingStatus();  //TODO move to attribute initialization?
    return {info:'Polling', value: "", data:[
            {id:'polled', info: "IsPolled", value: pollable.polled},
            {id:'poll_rate', info: "Period (ms)", value: pollable.poll_rate}
        ]};
}

export function savePollable(pollable, $$info){
    const polled = $$info.getItem('polled').value || $$info.getItem('polled').value === "true" || $$info.getItem('polled').value === "1";
    const poll_rate = $$info.getItem('poll_rate').value;
    pollable.updatePolling(polled, poll_rate)
        .fail(TangoWebappHelpers.error);
}

export function newInfoDatatable(){
    return {
        id: 'info',
        view: 'treetable',
        header:false,
        editable:true,
        columns:[
            {id:'info' , template:"{common.icon()} #info#"},
            {id:'value', editor: "text", template:(obj, common, value) => {
                    if(obj.id === 'polled') {
                        return common.checkbox(obj, common, obj.value, {
                            checkValue: true
                        });
                    }
                    else return value;
                }, fillspace: true}
        ],
        rules: {
            poll_rate: webix.rules.isNumber
        },
        on:{
            onBeforeEditStart:function(id){
                var row = id.row;
                return row !== 'polled';
            }
        }
    };
}

export function newInfoDatatableToolbar() {
    return {
        view:"toolbar",
        maxHeight: 30,
        cols:[
            {
                view:"icon",
                icon:"wxi-sync",
                click(){
                    this.getTopParentView().refresh();
                }
            },
            {},
            {
                view:"icon",
                icon:"wxi-check",
                click(){
                    this.getTopParentView().save();
                }
            }
        ]
    };
}

/**
 *
 * @param {AttributeInfo} info
 * @return {Array}
 */
function parseInfo(info){
    const result = [];
    result.push({id:'name',info:'Name', value: info.name});
    kAttr_info_values.forEach(el => result.push({id:el, info:MVC.String.classize(el), value: info[el]}));
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
                kAttr_alarms_values.map(el => ({id:el, info:MVC.String.classize(el), value: info.alarms[el]}))});
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

    result.push({info:'Alias', value: undefined});
    
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
        async save(){
            let $$info = this.$$('info');
            $$info.editStop();
            //flatten serialized structure
            const items = $$info.data.serialize().reduce((acc,val) => {
                acc.push(val);
                if(val.data) return acc.concat(val.data);
                return acc;
            },[]);
            items
                .filter(item => this.attr.info.hasOwnProperty(item.id))
                .forEach(item => this.attr.info[item.id] = item.value);

            items
                .filter(item => kAttr_alarms_values.includes(item.id))
                .forEach(item => this.attr.info.alarms[item.id] = item.value);

            //Change event
            this.attr.info.events.ch_event.rel_change = $$info.getItem('ch_event.rel_change').value;
            this.attr.info.events.ch_event.abs_change = $$info.getItem('ch_event.abs_change').value;

            //Periodic event
            this.attr.info.events.per_event.period = $$info.getItem('per_event.period').value;

            //Archive event
            this.attr.info.events.arch_event.rel_change = $$info.getItem('arch_event.rel_change').value;
            this.attr.info.events.arch_event.abs_change = $$info.getItem('arch_event.abs_change').value;
            this.attr.info.events.arch_event.period = $$info.getItem('arch_event.period').value;

            //TODO alias
            this.attr.putInfo()
                .then(() => OpenAjax.hub.publish("attr_info_panel.update_attr_info", {data: this.attr.info}))
                .fail(TangoWebappHelpers.error);

            savePollable(this.attr, $$info);
        },
        async refresh(){
            await this.attr.fetchInfo();
            this.setAttribute(this.attr);
        },
        /**
         *
         * @param {TangoAttribute} attr
         * @memberof ui.DeviceViewPanel.DevicePanelAttributes
         */
        async setAttribute(attr){
            this.attr = attr;
            const info = parseInfo(attr.info);

            info.push(await parsePollable(attr));

            const $$info = this.$$('info');
            $$info.clearAll();
            $$info.parse(info);
        },
        /**
         * @constructs
         * @memberof ui.DeviceViewPanel.DevicePanelAttributes
         */
        $init: function (config) {
            webix.extend(config, this._ui());
        }
    }, webix.ProgressBar, webix.IdSpace, webix.ui.layout);

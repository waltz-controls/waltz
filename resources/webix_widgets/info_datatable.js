/**
 * @module InfoDatatable
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
(function(){
    /**
     * @constant
     * @property {String} name
     * @memberof ui.InfoDatatable
     */
    var info_datatable = {
        id: 'info',
        view: 'datatable',
        header:false,
        columns:[
            {id:'info' },
            {id:'value', fillspace: true}
        ],
        on:{
            /** Event listener
             * @function
             * @param attr
             * @memberof ui.DeviceControlPanel.attr_info_datatable
             */
            onBindApply:function(attr){
                if(!attr) return false;
                var info = [];
                info.push({info:'Name', value: attr.name});
                attr_info_values.forEach(function(el){
                    info.push({info:MVC.String.classize(el), value: attr.info[el]})
                });
                this.clearAll();
                this.parse(info);
            }
        }
    };

    /**
     *
     * @param {function} parser
     * @return {info_datatable}
     * @memberof ui.InfoDatatable
     */
    TangoWebapp.ui.newInfoDatatable = function(parser){
        var result = webix.clone(info_datatable);
        result.on.onBindApply = parser;
        return result;
    }
})();
/**
 * @module Utils
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
(function(){
    /**
     * @namespace InfoDatatable
     * @memberof ui.Utils
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
            onBindApply:function(){
                throw new Error("This method must be overridden!!!");
            }
        }
    };

    /**
     * Factory function for InfoDatatable
     *
     * @param {function} parser
     * @return {InfoDatatable}
     * @memberof ui.Utils
     */
    TangoWebapp.ui.newInfoDatatable = function(parser){
        var result = webix.clone(info_datatable);
        result.on.onBindApply = parser;
        return result;
    }
})();
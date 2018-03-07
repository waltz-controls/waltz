/**
*
*/
FinalStep = MVC.Model.extend('FinalStep',
/* @Static */
{
    attributes:{
        id:'string',
        help:'string'
    },
    default_attributes:{
        id:'frmFinal',
        help:'This demonstrates all the values from the dataset that were actually downloaded from the server. Please review them carefully. If you find a mistake you can navigate to the corresponding Wizard step and correct the value.'
    },
    view:'views/main/FinalStep.ejs'
},
/* @Prototype */
{
    activate:function(){
        DataSet.create({
            name:DataSet.gDataSetName
        },{
            onComplete:function(data){
                if(data.errors && data.errors.length > 0){
                    $.each(data.errors,function(ndx){
                        noty.error(data.errors[ndx]);
                    });
                    return;
                }
                //TODO refactor this when Field model will be implemented
                //TODO reuse ViewHelpers#printField
                var $dataHolder = $(MVC.$E("dataHolder"));
                var values = [];
                var view = new View({url:'views/main/final.value.ejs'});
                for(var v in data.attributes())
                    values.push(view.render({
                        fld_id:v,
                        value:data[v]
                    }));
                $dataHolder.html(values.join("<br/>"));
                noty.success("Data has been successfully stored");
            },
            onFailure:function(url){
                noty.error(url + " does not respond");
            }
        });
    },
    toHtml:function(){
        return new View({url:this.Class.view}).render(this);
    }
}
);
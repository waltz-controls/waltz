/**
 *
 * User: ingvord
 * Date: 3/9/14
 */
DataSet = MVC.Model.JsonP.extend('DataSet',
    /*@Static*/
    {
        gDataSetName:'',
        domain:ApplicationContext.domain,
        id:'name',
        attributes:{
            name:'string'
        }
    },
    /*@Prototype*/
    {
        //template dummy property to prevent saving it in file
        responseText:{},
        set_responseText:function(v){
            this.responseText = v;
        },
        /**
         * This method returns only attributes with values
         *
         * @returns {{}}
         */
        attributes:function(){
            var attributes = this._super();
            var result = {};
            for(var attr in attributes){
                if(attributes.hasOwnProperty(attr))
                    if(attributes[attr]) result[attr] = attributes[attr];
            }
            return result;
        }
    }
);
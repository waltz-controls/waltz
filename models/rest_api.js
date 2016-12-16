RestApi = MVC.Model.extend("rest_api",
    /*@Static */
    {
        associations:{
            has_many: ["DataBase"]
        },
        attributes:{
            host:"string",
            url :"string",
            dbs :"DataBases"
        }
    },
    /*@Prototype */
    {}
);
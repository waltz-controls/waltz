WelcomeController = MVC.Controller.extend('rows',
    /* @Static */
    {
        dlgCreate:null,
        dlgUpload:null
    },
    /* @Prototype */
    {
        /**
         * This method responds when a new DataSet instance has been created.
         *
         * As JsonP model may publish this event not only when a fresh instance is created,
         * but also after update and find_all. We need to defend against such case.
         *
         *
         *
         * @param params
         */
        "DataSet.create.as_existing subscribe":function(params){
            var dataSet = params.data;
            var welcome = WelcomeStep.find_by_element(MVC.$E('WelcomeStep_frmWelcome'));
            //prevent creation of duplicated row, this is because destroy method also publishes this event
            if($.inArray(dataSet.name,welcome.data) > -1) return;

            console.log("DataSet["+dataSet.name+"] has been created");
            var $row = $(new View({url:'views/pre_experiment_data_collector/Welcome/dataset_row.ejs'}).render(dataSet));

            var $welcome = $(welcome.element());
            var $target = $('div.form-box',$welcome);

            $target.prepend($row);
            welcome.data.push(dataSet.name);
        },
        /**
         * This method responds when user clicks 'delete' button.
         *
         * It removes corresponding row from th UI and then invokes destroy method on the found dataset.
         *
         * When destroy returns this method removes corresponding data set name from WelcomeStep#data field
         * resets global current data set name and notifies user.
         *
         * @param params
         */
        "a.delete click"   : function (params) {
            var $btn = $(params.element);

            var $row = $btn.parent();
            var name = $('input[type=radio]', $row).val();

            $row.remove();

            var dataset = DataSet.find(function(inst){ return inst.name === name})[0];
            dataset.destroy({
                onComplete   : function () {
                    var welcome = WelcomeStep.find_by_element(MVC.$E('WelcomeStep_frmWelcome'));
                    var index = $.inArray(name,welcome.data);
                    console.log("Dataset has been found at index="+index);
                    welcome.data.splice(index,1);
                    DataSet.gDataSetName = '';
                    noty.success("Dataset[" + name + "] has been deleted.");
                },
                onFailure    : function (url) {
                    noty.error(url + " does not respond");
                }
            });
        },
        /**
         * This method responds when user click 'Create New' button.
         *
         * Basically it creates a new dialog. This dialog performs a couple of simple validations and sets hidden fields.
         *
         * These fields are then used in WelcomeStep#update to create a new data set.
         */
        "a#btnCreate click": function () {
            var frmWelcome = WelcomeStep.find_by_element(MVC.$E('WelcomeStep_frmWelcome'));
            if(!this.Class.dlgCreate) this.Class.dlgCreate = new MVC.MdlDialog(
                new MVC.Model.MdlDialog({
                    //MdlDialog
                    titel:'Create a new DataSet',
                    header:'Please enter a name:',
                    view:'views/pre_experiment_data_collector/Welcome/create.ejs',
                    //model specific fields
                    data:frmWelcome.data,
                    name:null,
                    template:null
                }),{
                    onSuccess:function(model){
                        $('#hdnNewDataSetName').val(model.name);
                        $('#hdnTmplName').val(model.template);
                        $('#flgCreateNew').val(true);
                        WizardController.wizard.$next.click();
                    }
                }
            );
            this.Class.dlgCreate.open();
        },
        "a#btnUpload click":function(){
            if(!this.Class.dlgUpload) {
                var uploadModel = MVC.Model.MdlDialog.extend({
                    _onOpen:function(dlg){
                        $('div.mdlDlg_model_container', dlg).append($(this.view.render(this)));
                        Controller.publish("FileUpload.initialize", { data: this });
                    }
                });

                this.Class.dlgUpload = new MVC.MdlDialog(
                    new uploadModel({
                        //FileUpload
                        id:'mdlDlgUploadDataSets',
                        name:'Choose files to upload:',
                        fields:[
                            {
                                type:'file',
                                id:'fldUploadDataSets'
                            }
                        ],
                        help:'Please select datasets created in the offline.',
                        //MdlDialog
                        titel:'Upload DataSets',
                        header:'',
                        view:'views/main/Welcome/upload.ejs'
                    }),{
                        height:680,
                        width:980,
                        onSuccess:function(model){
                            DataSet.find_all({
                                onComplete:function(){
                                    noty.success("Data has been successfully uploaded.");
                                },
                                onFailure:function(){
                                    noty.error("Data upload has failed");
                                }
                            });
                        }
                    }
                );
            }

            this.Class.dlgUpload.open();
        }
    }
);
/**
 *
 */
WelcomeStep = MVC.Model.extend('WelcomeStep',
    /* @Static */
    {
        attributes: {
            id: 'string',
            help: 'string',
            data:'String[]'
        },
        default_attributes: {
            id: 'frmWelcome',
            help: 'Choose or create a new dataset. When creating a new one make sure that its name is file name compatible.',
            data:[]
        },
        view: 'views/main/WelcomeStep.ejs',
        create:function(attributes,cbks){
            var instance = this.create_as_existing(attributes);
            instance.refresh(this._clean_callbacks(cbks));
        }
    },
    /* @Prototype */
    {
        validate: function () {
            var $this = $(this.element());

            //if no data set has been chosen nor a new one was created - validation fails
            if($("input[name=datasets]:checked", $this).length == 0 &&
                $('#flgCreateNew',$this).val() === 'false'){
                noty.error('Choose data set or create a new one!');
                return false;
            }

            return true;
        },
        update: function () {
            var $this = $(this.element());
            var dataSetName;
            var template;
            if ($('#flgCreateNew',$this).val() === 'true') {
                dataSetName = $('#hdnNewDataSetName', $this).val();
                template = $('#hdnTmplName', $this).val();
            }else {
                dataSetName = $("input[name=datasets]:checked", $this).val();
                template = "none";
            }
            //set global data set name
            DataSet.gDataSetName = dataSetName;


            var cbks = {
                onComplete: function (data) {
                    //reset "new"
                    $('#flgCreateNew',$this).val(false);
                    //update UI with values
                    $('form.step').each(function(){
                        var id = WizardStep.element_id_to_id($(this).attr('id'));
                        var step = WizardStep.find(id);
                        if(step != null)
                            step.refresh(data);
                    });
                    noty.success('Data has been loaded successfully');
                },
                onFailure:function(url){
                    noty.error(url + " does not respond");
                }
            };
            DataSet.create({
                name: dataSetName,
                template: template
            },cbks);
        },
        /**
         *
         * @returns {HTML}
         */
        toHtml: function () {
            return new View({url:this.Class.view}).render(this);
        }
    }
);
/**
*
*/
WizardStep = MVC.Model.JsonP.extend('WizardStep',
/* @Static */
{
find_all_url: ApplicationContext.domain + "/Meta",
domain: ApplicationContext.domain,
attributes: {
    id: "string",
    help: "text",
    label: "string",
    type: "string",
    fields: "Object[]",
    values: '{}'//this is need for backward compatibility
    //TODO dataset
},
default_attributes: {
    values: {}
},
view: 'views/pre_experiment_data_collector/wizard.step.###.ejs'
},
/* @Prototype */
{
/**
* Updates UI
*/
refresh: function (data) {
    var id = this.element_id();
    if (this.type == 'upload') {
        $.each(this.fields, function (nfx, fld) {
            if (!data[fld.id]) return;
            var files = $.map(data[fld.id], function (fileName) {
                return {
                    name: fileName,
                    url: ApplicationContext.domain + "/home/" + ApplicationContext.userName + "/upload/" + fileName
                };
            });
            Controller.publish("FileUpload.add_files",
                    {
                        id: id,
                        data: files
                    }
                );
        });
    } else {
        $.each(this.fields, function (ndx, fld) {
            $(MVC.$E(fld.id)).val(data[fld.id]);
            //multichoice special case
            if (fld.fields)
                $.each(fld.fields, function (ndx, fld) {
                    $(MVC.$E(fld.id)).val(data[fld.id]);
                });
        });
    }
},
/**
* Updates this values and sends them to the server
*/
update: function () {
    //TODO if we create a dedicated model for each fld then data can be updated directly from the fld
    //TODO additionally this code will be much clear
    //populate fields before update server
    var $this = $(this.element());
    var data = {
        name: DataSet.gDataSetName
    };
    //populate data with values from UI
    $.each(this.fields, function (ndx, fld) {
        if (this.type == 'file') {
            data[fld.id] = [];
            $('tr.file-row > td.name', $this).each(function () {
                data[fld.id].push($(this).text());
            });
        } else {
            data[fld.id] = $(MVC.$E(fld.id)).val();
        }
        //multichoice special case
        if (fld.fields)
            $.each(fld.fields, function (ndx, fld) {
                data[fld.id] = $(MVC.$E(fld.id)).val();
            });
    });

    console.log("Updating dataset[" + DataSet.gDataSetName + "]");
    var dataSet = DataSet.find(function(inst){ return inst.name === DataSet.gDataSetName})[0];
    dataSet.update_attributes(data, {
        onComplete: function () {
            console.log("Data has been updated successfully!");
            noty.alert("Data has been updated successfully!");
        },
        onFailure: function (data) {
            console.error("ERR: update has failed!");
            noty.error("ERR: update has failed!");
            for (var i = 0, size = data.errors.length; i < size; ++i) {
                console.error(data.errors[i]);
                noty.error(data.errors[i]);
            }
        }
    });
},
/**
*
* @returns {boolean}
*/
validate: function () {
    var $this = $(this.element());
    return $this.validationEngine('validate');
},
toHtml: function () {
    return new View({ url: this.Class.view.replace("###", this.type) }).render(this, WizardStepViewHelpers);
}
});
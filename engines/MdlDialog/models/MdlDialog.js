/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 11.03.14
 */
MVC.Model.MdlDialog = MVC.Model.extend('MVC.Model.MdlDialog',
    /*@Static*/
    {
        attributes        : {
            titel : 'String',
            header: 'String'
        },
        default_attributes: {
            titel : 'Empty dialog',
            header: 'Empty dialog'
        }
    },
    /*@Prototype*/
    {
        view    : null,
        set_view: function (v) {
            this.view = new View({url: v});
        },
        _onOpen  : function (dlg) {
            $('div.mdlDlg_model_container', dlg).html(this.view.render(this));
        },
        _onClose : function () {

        }
    });

if (!MVC._no_conflict && typeof Model.MdlDialog == 'undefined') {
    Model.MdlDialog = MVC.Model.MdlDialog;
}
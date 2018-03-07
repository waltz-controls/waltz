/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 11.03.14
 */
MVC.MdlDialog = MVC.Controller.Stateful.extend('MdlDialog',
    /*@Static*/
    {
        id:0,
        default_options:{
            autoOpen: false,
            height  : 300,
            width   : 350,
            modal   : true,
            buttons : {
                Cancel : function () {
                    $(this).dialog("close");
                }
            },
            close   : function () {
                //TODO remove error class
            }
        }
    },
    /*@Prototype*/
    {
        /**
         *
         * @param model
         * @param options [optional]
         */
        init:function(model,options){
            //TODO check arguments
            this.id = 'mdlDlg_' + ++this.Class.id;
            this.model = model;
            this.options = {};
            MVC.Object.extend(this.options,this.Class.default_options);
            MVC.Object.extend(this.options,options);
            MVC.Object.extend(this.options.buttons,{
                Confirm:this._onConfirm()
            });

            this.render({
                bottom:document.body,
                action:'init'
            });
            this._super(MVC.$E(this.id));
            this.$element = $(this.element);
            this.$form = $('form',this.$element);
            this.$form.validationEngine();
            this.$element.dialog(this.options);
        },
        open:function(){
            this.model._onOpen(this.$element);
            this.$element.dialog('open')
        },
        _onConfirm:function(){
            return MVC.Function.bind(function(){
                if(!this.$form.validationEngine('validate')) return;
                var values = this.$form.serializeObject();
                var model = this.model;
                var isOk = model.update_attributes(values);
                if(!isOk){
                    var tips = $('.validateTips', this.$element);
                    tips.addClass( "ui-state-highlight" );
                    tips.text('');
                    $.each(model.errors.splice(0,model.errors.length),function(ndx,error){
                        tips.append(error).append('<br/>');
                    });
                    setTimeout(function() {
                        tips
                            .text(model.header)
                            .removeClass( "ui-state-highlight", 1500 );
                    }, 5000 );
                    return;
                }
                this.$element.dialog('close');
                this.options.onSuccess(this.model);
            },this);
        }
    }
);
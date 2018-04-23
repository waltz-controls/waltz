/**
 * Controller
 *
 * @type {TopToolbarController}
 */
TangoWebappPlatform.TopToolbarController = MVC.Controller.extend('top_toolbar_controller',
    /* @Static */
    {
        getUI: function () {
            webix.protoUI({
                name: 'top_toolbar',
                defaults: {
                    height: 32,
                    cols: [
                        {
                            view: "template",
                            type: "header",
                            borderless: true,
                            width: 100,
                            template: "<a target='_blank' href='http://tango-controls.org'><span style='width: 240px'><img alt='Tango-Controls' style='max-width: 100%; max-height: 100%' src='../../images/platform/logo_tangocontrols.png'></span></a>"
                        },
                        {
                            view: "template",
                            type: "header",
                            borderless: true,
                            template: "<a target='_blank' href='http://www.hzg.de'><span style='width: 240px'><img alt='Helmholtz-Zentrum Geesthacht' style='max-width: 100%; max-height: 100%' src='../../images/platform/hzg_rgb_mitzusatz_in_e_300dpi.png'></span></a>"
                        },
                        {
                            // gravity: 4
                        },
                        {
                            align: 'right',
                            cols: [
                                {
                                    type: 'icon',
                                    id: "btnUsername",
                                    view: 'button',
                                    label: "#name#",
                                    tooltip: "#name#",
                                    icon: "user",
                                    align: "right",
                                    width: 100,
                                    click:function(){
                                        if($$('settings')){
                                            $$('settings').show();
                                        }
                                    }
                                },
                                {
                                    view: "button",
                                    id: "btnUser",
                                    type: "icon",
                                    tooltip: "Sign out...",
                                    icon: "sign-out",
                                    width: 36,
                                    click: function () {
                                        OpenAjax.hub.publish('platform.user_logout', {});
                                    },
                                    align: "right"
                                }
                            ]
                        }
                    ]
                }
            }, webix.IdSpace, webix.ui.toolbar);

            return {
                view: 'top_toolbar',
                id: 'top-toolbar'
            };
        }
    },
    /* @Prototype */
    {
        "user_context.create.as_existing subscribe": function (event) {
            var context = event.data;

            $$("top-toolbar").$$("btnUsername").define('tooltip', context.user);
            $$("top-toolbar").$$("btnUsername").define('label', context.user);
            $$("top-toolbar").$$("btnUsername").refresh();
        }
    }
);
/**
 * Controller
 *
 * @type {TopToolbarController}
 */
TangoWebapp.TopToolbarController = MVC.Controller.extend('top_toolbar_controller',
    /* @Static */
    {
    },
    /* @Prototype */
    {
        "platform_api.ui.initialized subscribe": function (event) {
            var context = event.data.context.UserContext;

            $$("top-toolbar").$$("btnUsername").define('tooltip', context.user);
            $$("top-toolbar").$$("btnUsername").define('label', context.user);
            $$("top-toolbar").$$("btnUsername").refresh();
        }
    }
);
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
        "user_context.create.as_existing subscribe": function (event) {
            var context = event.data;

            $$("top-toolbar").$$("btnUsername").define('tooltip', context.user);
            $$("top-toolbar").$$("btnUsername").define('label', context.user);
            $$("top-toolbar").$$("btnUsername").refresh();
        }
    }
);
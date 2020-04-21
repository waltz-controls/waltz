import "./stylesheets/waltz.css";
// import "../models/platform/subscriptions.js";
// import "../models/tango_webapp/user_action.js";
// import "../resources/webix_widgets/import.js";
import {Application} from "@waltz-controls/middleware";
import LoginWidget from "login";
import MainWindow from "main_window";
import AjaxLoader from "controllers/ajax_loader";
import LoginController from "controllers/login";

// TangoWebappPlatform.consts.LOG_DATE_FORMATTER = webix.Date.dateToStr("%c");

new Application({name: APPNAME, version: VERSION})
    .registerErrorHandler(err => console.error(err))
    .registerController(new AjaxLoader())
    .registerController(new LoginController())
    .registerWidget(new LoginWidget())
    .registerWidget(new MainWindow())
    .run();


// new LoginController()
//     .run()
//     .then(user => {
//         //TODO migrate to fetch
//         webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
//             x.withCredentials = true;
//             Object.assign(headers, user.headers);
//         });
//
//         //In fact requests UserContext from /user-context/cache
//         return TangoWebappPlatform.UserContext.find_one(user.name);
//     })
//     .then(userContext => {
//         TangoWebappHelpers.debug(userContext.toString());
//
//         const rest = new TangoWebappPlatform.TangoRestApi({url: userContext.rest_url});
//         const eventbus = new EventBus();
//
//         TangoWebappPlatform.PlatformContext.create({
//             UserContext: userContext,
//             rest,
//             eventbus
//         });
//
//         TangoWebappHelpers.debug("platform/main done.");
//     });
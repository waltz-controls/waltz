import "../stylesheets/tango_webapp.css";

import {EventBus} from "@waltz-controls/eventbus"
import {LoginController, UserLogin} from "../controllers/login";

import "../models/platform/subscriptions.js";
import "../models/tango_webapp/user_action.js";
import "../resources/webix_widgets/import.js";

window.addEventListener("error", function (e) {
    TangoWebappHelpers.error("Unhandled exception!", e);
    return false;
});

TangoWebappPlatform.consts.LOG_DATE_FORMATTER = webix.Date.dateToStr("%c");

new LoginController()
    .run()
    .then(user => {
        //TODO migrate to fetch
        webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
            x.withCredentials = true;
            Object.assign(headers, user.headers);
        });

        //In fact requests UserContext from /user-context/cache
        return TangoWebappPlatform.UserContext.find_one(user.name);
    })
    .then(userContext => {
        TangoWebappHelpers.debug(userContext.toString());

        const rest = new TangoWebappPlatform.TangoRestApi({url: userContext.rest_url});
        const eventbus = new EventBus();

        TangoWebappPlatform.PlatformContext.create({
            UserContext: userContext,
            rest,
            eventbus
        });

        TangoWebappHelpers.debug("platform/main done.");
    });
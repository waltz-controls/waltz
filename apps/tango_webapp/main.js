import "../../models/platform/subscriptions.js";
import "../../resources/webix_widgets/import.js";

import * as XenvWidget from "../../resources/webix_widgets/xenv.js";

window.addEventListener("error", function (e) {
    TangoWebappHelpers.error("Unhandled exception!", e);
    return false;
});

function load_user_context(){
    var authorization = webix.storage.session.get("Authorization");
    if (authorization !== null && authorization.indexOf('Basic ') === 0) {
        webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
            x.withCredentials = true;
            headers["Authorization"] = webix.storage.session.get("Authorization");
        });
        var username = atob(authorization.substring(6)).split(':')[0];

        return TangoWebappPlatform.UserContext.find_one(username);
    } else {
        TangoWebappHelpers.log("No Authorization found, fallback to test user context");
        webix.attachEvent("onBeforeAjax", function (mode, url, params, x, headers) {
            x.withCredentials = true;
            headers["Authorization"] = "Basic " + btoa("tango-cs:tango");
        });
        return TangoWebappPlatform.UserContext.find_one("tango-cs");
    }
}

/**
 * This is the main entry point of the application. This function is invoked after jmvc has been completely initialized.
 *
 * @param {Object} params
 */
(function(){
//override date formatter
TangoWebappPlatform.consts.LOG_DATE_FORMATTER = webix.Date.dateToStr("%c");

var user_ctx = load_user_context();

TangoWebappHelpers.debug(user_ctx.toString());

var rest = new TangoWebappPlatform.TangoRestApi({url: user_ctx.rest_url});

TangoWebappPlatform.PlatformContext.create({
    UserContext: user_ctx,
    rest: rest
});

TangoWebappHelpers.debug("platform/main done.");
})();
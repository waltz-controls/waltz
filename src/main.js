import "../stylesheets/loader.css";
import "../stylesheets/waltz.css";
// import "../models/platform/subscriptions.js";
// import "../models/tango_webapp/user_action.js";
// import "../resources/webix_widgets/import.js";
import {Application} from "@waltz-controls/middleware";
import LoginWidget from "widgets/login";
import MainWindow from "widgets/main_window";
import AjaxLoader from "controllers/ajax_loader";
import LoginController from "controllers/login";
import TangoTree from "widgets/tango/tree";
import ApplicationLogController from "controllers/log";
import WebixMessageController from "controllers/message";
import TangoDeviceWidget from "widgets/tango/device";
import {UserContextController} from "@waltz-controls/waltz-user-context-plugin";
import {UserActionController} from "@waltz-controls/waltz-user-actions-plugin";
import TangoInfoPanelWidget from "widgets/tango/info";
import {TangoRestController, TangoSubscriptionsController} from "@waltz-controls/waltz-tango-rest-plugin";
import DashboardWidget from "widgets/tango/dashboard";

// TangoWebappPlatform.consts.LOG_DATE_FORMATTER = webix.Date.dateToStr("%c");

const waltz = new Application({name: APPNAME, version: VERSION})
    .registerErrorHandler(err => console.error(err))
    .registerController(new AjaxLoader())
    .registerController(new LoginController())
    .registerController(new TangoRestController())
    .registerController(new TangoSubscriptionsController())
    .registerController(new ApplicationLogController())
    .registerController(new WebixMessageController())
    .registerController(new UserContextController())
    .registerController(new UserActionController())
    .registerWidget(new MainWindow())
    .registerWidget(new DashboardWidget())
    .registerWidget(new TangoTree())
    .registerWidget(new TangoDeviceWidget())
    .registerWidget(new TangoInfoPanelWidget())


export const kWaltz = 'app:waltz';

new Application({name: 'WaltzLogin', version: VERSION})
    .registerErrorHandler(err => console.error(err))
    .registerContext(kWaltz, waltz)
    .registerWidget(new LoginWidget())
    .run();
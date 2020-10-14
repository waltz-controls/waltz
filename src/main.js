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
import {UserActionController, UserLogWidget} from "@waltz-controls/waltz-user-actions-plugin";
import TangoInfoPanelWidget from "widgets/tango/info";
import {TangoRestController, TangoSubscriptionsController} from "@waltz-controls/waltz-tango-rest-plugin";
import DashboardWidget from "widgets/tango/dashboard";
import WaltzHintWidget from "widgets/hint";

// TangoWebappPlatform.consts.LOG_DATE_FORMATTER = webix.Date.dateToStr("%c");

const waltz = new Application({name: APPNAME, version: VERSION})
    .registerErrorHandler(err => console.error(err))
    .registerController(() => new AjaxLoader())
    .registerController(application => new LoginController(application))
    .registerController(application => new TangoRestController(application))
    .registerController(application => new TangoSubscriptionsController(application))
    .registerController(application => new ApplicationLogController(application))
    .registerController(application => new WebixMessageController(application))
    .registerController(application => new UserContextController(application))
    .registerController(application => new UserActionController(application))
    .registerWidget(application => new MainWindow(application))
    .registerWidget(application => new DashboardWidget(application))
    .registerWidget(application => new TangoTree(application))
    .registerWidget(application => new TangoDeviceWidget(application))
    .registerWidget(application => new TangoInfoPanelWidget(application))
    .registerWidget(application => new UserLogWidget(application))
    .registerWidget(application => new WaltzHintWidget(application))


export const kWaltz = 'app:waltz';

new Application({name: 'WaltzLogin', version: VERSION})
    .registerErrorHandler(err => console.error(err))
    .registerContext(kWaltz, waltz)
    .registerWidget(application => new LoginWidget(application))
    .run();
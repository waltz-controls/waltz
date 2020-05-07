import {WaltzWidget} from "@waltz-controls/middleware";
import "views/scripting_console";
import {kUserContext} from "controllers/user_context";
import {kChannelLog, kTopicLog} from "controllers/log";
import UserScript from "models/user_script";
import {kMainWindow} from "widgets/main_window";
import {ExecuteUserScript} from "models/user_action";
import {kControllerUserAction} from "controllers/user_action_controller";

export const kWidgetScripting = 'widget:scripting';
const kOverwrite = true;

export default class ScriptingWidget extends WaltzWidget {
    constructor(app) {
        super(kWidgetScripting, app);
        const proxy = {
        $proxy: true,
            load: (view, params) => {
            return this.app.getContext(kUserContext)
                .then(userContext => userContext.getOrDefault(this.name, []).map(script => new UserScript({...script})));
        },
            save: (master, params, dataProcessor) =>{
            let promiseContext = this.app.getContext(kUserContext);
            switch(params.operation){
                case "insert":
                    promiseContext = promiseContext
                        .then(userContext => userContext.updateExt(this.name, ext => ext.push(params.data)))
                    break;
                case "update":
                    promiseContext = promiseContext
                        .then(userContext => userContext.updateExt(this.name, ext =>
                            webix.extend(
                                ext.find(script => script.id === params.id),
                                params.data,
                                kOverwrite)));
                    break;
                case "delete":
                    promiseContext = promiseContext
                        .then(userContext => {
                            const indexOf = userContext.get(this.name).findIndex(script => script.id === params.id)
                            return userContext.updateExt(this.name, ext => ext.splice(indexOf, 1));
                        });
                    break;
            }

            return promiseContext
                .then(userContext => userContext.save())
                .then(() => this.dispatch(`Successfully ${params.operation}ed UserScript[${params.id}]`,kTopicLog, kChannelLog));
        }
    };

    this.data = new webix.DataCollection({
        url: proxy,
        save: proxy
    });
    }

    ui(){
        return {
            header: "<span class='webix_icon wxi-pencil'></span> Scripting",
            close: true,
            body:
                {
                    id: this.name,
                    view: "scripting_console",
                    root:this
                }
        }
    }

    run(){
        const tab = $$(this.name) || $$(this.app.getWidget(kMainWindow).mainView.addView(this.ui()));
        tab.show();
    }

    /**
     *
     * @param {UserScript} script
     */
    saveScript(script){
        if (this.data.exists(script.id))
            this.data.updateItem(script.id, script);
        else
            this.data.add(script);

        this.dispatch(`Saving UserScript[${script.name}]`,kTopicLog, kChannelLog);

        return script;
    }

    /**
     *
     * @param {string} id
     */
    removeScript(id){
        this.data.remove(id);

        this.dispatch(`Removing UserScript[${id}]`,kTopicLog, kChannelLog);
    }

    /**
     *
     * @param {UserScript} script
     * @return {Promise<*>}
     */
    async executeScript(script){
        const user = (await this.app.getContext(kUserContext)).user;

        return this.app.getController(kControllerUserAction)
                            .submit(new ExecuteUserScript({user, script}));
    }

}
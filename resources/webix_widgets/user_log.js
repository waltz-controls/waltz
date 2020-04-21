import {kUserActionDone, kUserActionsChannel, UserAction} from "../../src/models/tango_webapp/user_action.js";

/**
 *
 * @module UserLog
 * @memberof ui
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 9/10/18
 */
const user_log = webix.protoUI({
    name: 'user_log',
    ui(){
        return {
            /**
             *
             * @param {UserAction} action
             * @return {string}
             */
            template(action){
                return `<div>${action.hasFailed() ? '<span class="webix_icon red mdi mdi-alert"></span>' : ''}${action.redoable ? '<span class="webix_icon mdi mdi-redo-variant"></span>' : ''}<strong>${TangoWebappPlatform.consts.LOG_DATE_FORMATTER(new Date(action.id))}</strong></div>${action.toMessage()}`;
            },
            click(id){
                const action = this.getItem(id);
                if(action.redoable)
                webix.confirm(`<div>Confirm redo action ${action.action} on ${action.target}?</div>${action.toMessage()}`, "confirm-warning")
                    .then(() => {
                        Object.assign(action,{id: +new Date()}).submit();
                    });
            }
        }
    },
    /**
     *
     * @param {UserAction} action
     */
    log(action){
        this.addFirst(action)
    },
    $init(config){
        webix.extend(config, this.ui());
        config.context.eventbus.subscribe(kUserActionDone,this.log.bind(this),kUserActionsChannel);
    },
    defaults:{
        limit: 25,
        type: {
            height: Infinity
        }
    }
}, webix.ui.list, TangoWebappPlatform.mixin.BoundedReverseList);


/**
 * @param {PlatformContext} context
 * @memberof ui.UserLog
 */
TangoWebapp.ui.newUserLogPanel = function(context){
    return {
        header: "<span class='webix_icon mdi mdi-comment-text-outline'></span>",
        width: 300,
        collapsed: false,
        body: {
            context: context,
            view: 'user_log',
            id: 'user-log'
        }
    };
}

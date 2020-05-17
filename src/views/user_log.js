import {
    ExecuteTangoCommand,
    ReadTangoAttribute,
    ReadTangoPipe,
    UpdateDeviceAlias,
    UpdateTangoAttributeInfo,
    UserAction,
    WriteTangoAttribute
} from "models/user_action";
import {BoundedReverseList} from "@waltz-controls/waltz-webix-extensions";
import {kControllerUserAction} from "controllers/user_action_controller";
import {kInprocChannel} from "@waltz-controls/middleware";
import {kChannelTango} from "@waltz-controls/waltz-tango-rest-plugin";
import {kAnyTopic} from "@waltz-controls/eventbus";

function log(target){
    return function(action){
        target.addFirst(action);
    }
}

function getFormatter(action){
    if(action.target === 'tango'){
        return new TangoUserActionFormatter(action)
    } else {
        return new UserActionFormatter(action);
    }
}

class UserActionFormatter {
    constructor(action) {
        this.action = action;
    }

    toMessage(){
        return `<span><span class="webix_icon mdi mdi-account"></span><strong>${this.action.user}</strong>
                <div>performs action <strong>${this.action.action}</strong> on <strong>${this.action.target}</strong></div>`;
    }
}

class TangoUserActionFormatter extends UserActionFormatter{
    constructor(action) {
        super(action);
    }

    getTail(){
        switch (this.action.action) {
            case ReadTangoPipe.action:
                return `<div><strong>.read() => ...</strong></div>`;
            case ReadTangoAttribute.action:
                return `<div style="background-color: #D5E7B3"><strong>.read() => ${this.action.data.value}</strong></div>`;
            case WriteTangoAttribute.action:
                return `<div style="background-color: aliceblue"><strong>.write(${this.action.value}) => ${this.action.data.value}</strong></div>`;
            case ExecuteTangoCommand.action:
                return `<div style="background-color: #e7b3b3"><strong>.execute(${this.action.value}) => ${this.action.data.output}</strong></div>`;
            case UpdateDeviceAlias.action:
                return  `<div><strong>${this.action.remove ? 'removes' : ''} ${this.action.device.id}.alias(${this.action.alias})</strong></div>`;
            case UpdateTangoAttributeInfo.action:
                return `<div><strong>updates info of ${this.action.attribute.id}</strong></div>`;
            default:
                return "";
        }
    }

    toMessage(){
        return `${super.toMessage()}
                <div><ul><li>host: <i>${this.action.tango_id.getTangoHostId()}</i></li>
                         <li>device: <i>${this.action.tango_id.getTangoDeviceName()}</i></li>
                         <li>member: <i>${this.action.tango_id.name}</i></li>
                </ul></div>
                ${this.getTail()}`;
    }

}

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
                return `<div>${action.hasFailed() ? '<span class="webix_icon red mdi mdi-alert"></span>' : ''}${new Date(action.id)}</div>${action.redoable ? '<span class="redo webix_icon mdi mdi-redo-variant"></span>' : ''}${getFormatter(action).toMessage()}`;
            }
        }
    },
    $init(config){
        webix.extend(config, this.ui());

        //TODO pending action
        config.root.middleware.subscribe(kControllerUserAction,kInprocChannel,log(this));
        config.root.middleware.subscribe(kAnyTopic,kChannelTango,log(this));
    },
    defaults:{
        limit: 25,
        type: {
            height: Infinity
        }
    }
}, webix.ui.list, BoundedReverseList);

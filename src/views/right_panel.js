import "views/user_log";
import {kControllerUserAction} from "controllers/user_action_controller";

export default function newRightPanel(root){
    return {
        id:'right_panel',
        rows:[
            {
                id: 'user_log',
                view: 'user_log',
                root,
                onClick:{
                    "redo"(ev, id){
                        const action = this.getItem(id);
                        if(action.redoable)
                            webix.confirm(`<div>Confirm redo action <strong>${action.action}</strong> on <strong>${action.target}</strong>?</div>`, "confirm-warning")
                                .then(() => {
                                    this.config.root.app.getController(kControllerUserAction).submit(Object.assign(action,{id: +new Date()}));
                                });
                    }
                }
            }
        ]
    }
}
import "views/tango/command_view";
import MemberWidget from "widgets/tango/member";
import {kUserContext} from "@waltz-controls/waltz-user-context-plugin";
import {kControllerUserAction} from "controllers/user_action_controller";
import {ExecuteTangoCommand} from "models/user_action";

export default class CommandWidget extends MemberWidget{
    /**
     *
     * @param {Application} app
     * @param {TangoCommand} cmd
     */
    constructor(app, cmd) {
        super(app, cmd, "command_view");

        this.listen(ExecuteTangoCommand.action);
    }

    get command(){
        return this.member;
    }

    update(response){
        this.view.output.update(response);
    }

    async execute(value){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction)
            .submit(new ExecuteTangoCommand({user, command: this.command, value}));
    }

}
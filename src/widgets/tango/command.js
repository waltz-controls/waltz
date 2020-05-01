import "views/tango/command_view";
import MemberWidget from "widgets/tango/member";
import {kUserContext} from "controllers/user_context";
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

        this.listen(action => {
            if(action.action === "exec" && action.command.id === this.command.id)
                this.view.output.update(action.data)
        },kControllerUserAction)
    }

    get command(){
        return this.member;
    }

    async execute(value){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction)
            .submit(new ExecuteTangoCommand({user, command: this.command, value}));
    }

}
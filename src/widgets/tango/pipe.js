import "views/tango/pipe_view";
import {kControllerUserAction} from "controllers/user_action_controller";
import {ReadTangoPipe} from "models/user_action";
import {kUserContext} from "controllers/user_context";
import MemberWidget from "widgets/tango/member";

export default class PipeWidget extends MemberWidget {
    /**
     *
     * @param {Application} app
     * @param {TangoPipe} pipe
     */
    constructor(app, pipe) {
        super(app,pipe, "pipe_view");
        this.listen(action => {
            if(action.action === "pipe" && action.pipe.id === this.pipe.id)
                this.update(action.data)
        },kControllerUserAction)
    }

    get pipe(){
        return this.member;
    }



    update(data){
        this.view.plot.update(data)
    }

    async refresh(){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction)
            .submit(new ReadTangoPipe({user, pipe: this.pipe}))
    }
}
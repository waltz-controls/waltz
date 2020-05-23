import "views/tango/pipe_view";
import {kControllerUserAction, ReadTangoPipe} from "@waltz-controls/waltz-user-actions-plugin";
import {kUserContext} from "@waltz-controls/waltz-user-context-plugin";
import MemberWidget from "widgets/tango/member";

export default class PipeWidget extends MemberWidget {
    /**
     *
     * @param {Application} app
     * @param {TangoPipe} pipe
     */
    constructor(app, pipe) {
        super(app,pipe, "pipe_view");
        this.listen(ReadTangoPipe.action)
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
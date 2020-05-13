import {WaltzWidget} from "@waltz-controls/middleware";
import HostTabWidget from "./host";
import {kChannelTango} from "models/tango";

function header(member){
    return `<span class='webix_icon mdi mdi-${member.icon}'></span>[<span class='webix_strong'>${member.device}/${member.name}</span>]`;
}

export default class MemberWidget extends WaltzWidget{
    constructor(app, member, view) {
        super(member.id, app);
        this.member = member;
        this.view_name = view;
    }

    listen(topic){
        super.listen(action => {
            if(action.tango_id.getTangoMemberId() === this.member.tango_id.getTangoMemberId())
                this.update(action.data)
        },topic,kChannelTango)
    }

    ui(){
        return {
            header: header(this.member),
            close: true,
            borderless: true,
            body: {
                id: this.member.id,
                root: this,
                view: this.view_name
            }
        }
    }

    /**
     * Returns this widget's webix view
     *
     * @return {webix.ui}
     */
    get view(){
        return $$(this.member.id);
    }

    run(){
        const hostTab = $$(this.member.host) || new HostTabWidget(this.member.host, this.app).run(this.ui())

        hostTab.show();

        const tab = $$(this.member.id) || $$(hostTab.addView(this.ui()));

        tab.show();

        return this;
    }


}
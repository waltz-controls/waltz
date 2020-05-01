import "views/tango/scalar_view";
import "views/tango/spectrum_view";
import "views/tango/image_view";
import MemberWidget from "widgets/tango/member";
import {kUserContext} from "controllers/user_context";
import {kControllerUserAction} from "controllers/user_action_controller";
import {ReadTangoAttribute, WriteTangoAttribute} from "models/user_action";
import {kTangoRestContext} from "controllers/tango_rest";


function view(attr){
    if(attr.isScalar())
        return "scalar_view";
    if(attr.isSpectrum())
        return "spectrum_view";
    if(attr.isImage())
        return "image_view";
    throw new Error(`Unsupported attribute format: ${attr.info.data_format}`);
}

export default class AttributeWidget extends MemberWidget {
    constructor(app, attr) {
        super(app, attr, view(attr));

        this.listen(ReadTangoAttribute.action)
        this.listen(WriteTangoAttribute.action)
    }

    get attribute(){
        return this.member;
    }

    update(response){
        if(Array.isArray(response))
            this.view.plot.updateMulti(response);
        else
            this.view.plot.update(response);
    }

    async read(){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction)
            .submit(new ReadTangoAttribute({user, attribute: this.attribute}));
    }

    async readHistory(){
        const rest = await this.app.getContext(kTangoRestContext);

        return rest.newTangoAttribute(this.attribute.tango_id).history()
            .toPromise()
            .then(response => this.update(response))
            .catch(err => {
                this.dispatchError(err)
                throw err;
            });
    }

    async writeAttribute(attribute, value){
        const user = (await this.app.getContext(kUserContext)).user;
        this.app.getController(kControllerUserAction).submit(new WriteTangoAttribute({user, attribute, value}));
    }
}
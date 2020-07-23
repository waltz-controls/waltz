import "views/tango/grid_widget.jsx";
import {WaltzWidget} from "@waltz-controls/middleware";



export default class GridViewWidget extends WaltzWidget {
    constructor({id, app}) {
        super(id, app);

    }

    get id(){
        return this.name;
    }

    ui(){
        return {
            view: 'grid_widget',
            root: this,
            id: this.id
        }
    }


    /**
     *
     * @param {TangoId} id
     */
    addDevice(id){
        alert(id.getTangoDeviceFQDN())
        //TODO fetch device with attributes and void commands and pass to GridWidget
    }
}
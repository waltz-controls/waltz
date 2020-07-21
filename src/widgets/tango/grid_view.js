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
            id: this.id
        }
    }


}
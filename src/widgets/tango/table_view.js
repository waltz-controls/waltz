import "views/tango/table_widget";

import {WaltzWidget} from "@waltz-controls/middleware";

const kWidgetTableView = 'widget:table_view';



export default class TableViewWidget extends WaltzWidget {
    constructor(id, app) {
        super(id);
    }

    ui(){
        return {
            view:"table_widget",
            id: this.id,
            root: this
        }
    }
}
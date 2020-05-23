import {Controller} from "@waltz-controls/middleware";

export default class AjaxLoader extends Controller {
    run(){
        webix.html.remove(document.getElementById('ajax-loader'));
    }
}
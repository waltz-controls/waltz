import "views/user_log";

export default function newRightPanel(root){
    return {
        id:'right_panel',
        rows:[
            {
                id: 'user_log',
                view: 'user_log',
                root
            }
        ]
    }
}
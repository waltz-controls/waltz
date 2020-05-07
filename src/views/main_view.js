export default function newMainView(root){
    return {
        root,
        id:'main_view',
        view: "tabview",
        type: 'space',
        padding: 0,
        tabbar: {
            height: 24,
            popupWidth: 480,
            tabMinWidth: 250,
            tabMoreWidth: 40,
            bottomPadding: 5,
            on: {
                onBeforeTabClose(id) {
                    if($$(id) && $$(id).beforeCloseMain) $$(id).beforeCloseMain();
                }
            }
        },
        cells: [{}]
    }
}
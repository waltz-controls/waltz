export function newToolbarButton(icon, target){
    return {
        view: "icon",
        icon:`mdi mdi-${icon}`,
        click(){
            const $$target = this.getTopParentView().$$(target);
            if($$target.isVisible())
                $$target.hide()
            else
                $$target.show()
        }
    }
}
/**
 *
 * @author Igor Khokhriakov <igor.khokhriakov@hzg.de>
 * @since 6/12/19
 */
// import {newTableWidgetBody} from "./table_widget.js";
// import {newPlotlyWidgetBody} from "./plotly_widget.js";




export function newDashboardToolbar() {
    return {
        view: "toolbar",
        maxHeight: 30,
        cols: [
            {
                view: "richselect",
                id: "profiles",
                label: "Profile",
                options: {
                    template: "#value# (#type#)",
                    data:[]
                },
                on: {
                    onChange: function (profileId) {
                        const profile = this.getList().getItem(profileId);
                        if(profile) {//prevent undefined when deleting
                            this.getTopParentView().selectProfile(profile);
                            webix.message(`Select profile ${profile.value}`);
                        }
                    }
                }
            },
            {},
            {
                view: "icon",
                css:"add_profile_icon",
                icon: "wxi-plus-square",
                maxWidth: 30,
                click: function () {
                    const $$frmProfile = this.getTopParentView().$$('frmProfileSettings');
                    if ($$frmProfile.isVisible())
                        $$frmProfile.hide();
                    else
                        $$frmProfile.show();
                }
            }
        ]
    }
}



const dashboard_widget = webix.protoUI({
    name: "dashboard_widget",
    getInitialState(){
        return [
            new Profile(webix.uid(), "default", "table")]
    },
    restoreState(state){
        if (state.data[0] === undefined) return;

        state.data.forEach(profile => {
            profile.viewId = this.$$("multiview").addView(createInnerWidget(profile.type, {
                id: profile.id
            }))
        });
        this.$$("profiles").getList().parse(state.data);
        this.$$("profiles").setValue(state.data[0].id);

    },
    selectProfile(profile){
        this.$$('frmProfileSettings').setValues(profile);
        $$(profile.viewId).show();
    },
    _ui() {
        return {
            rows: [
                newDashboardToolbar(),
                newProfileForm(),
                {
                    view: "multiview",
                    id: "multiview",
                    cells: [
                        {
                            id: "loading",
                            template: "<span class='webix_icon wxi-sync waltz-spin'></span>"
                        }
                    ]
                }
            ]
        }
    },
    $init(config) {
        webix.extend(config, this._ui());
    }
}, webix.IdSpace, webix.ui.layout);
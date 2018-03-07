/**
 * Model ui_builder
 *
 * @type {UIBuilder}
 */
UIBuilder = MVC.Model.extend('ui_builder',
    /* @Static */
    {

        attributes: {},
        default_attributes: {}
    },
    /* @Prototype */
    {
        _ui: null,
        init: function () {
            this._ui = {
                main: []
            };
        },
        _enable_left_sidebar: function () {
            this._ui['left'] = [];
        },
        _enable_right_sidebar: function () {
            this._ui['right'] = [];
        },
        add_left_sidebar_item: function (item) {
            if (!this._ui.hasOwnProperty('left')) this._enable_left_sidebar();
            this._ui['left'].push(item);
        },
        set_left_item: function (item) {
            this._set_left_item = true;
            this._ui['left'] = item;
        },
        add_right_sidebar_item: function (item) {
            if (!this._ui.hasOwnProperty('right')) this._enable_right_sidebar();
            this._ui['right'].push(item);
        },
        set_right_item: function (item) {
            this._set_right_item = true;
            this._ui['right'] = item;
        },
        add_mainview_item: function (item) {
            this._ui['main'].push(item);
        },
        _build: function (what) {
            if (this['_set_' + what + '_item']) return this._ui[what];
            else
                return {
                    header: '<span class="webix_icon fa-bars"></span>',
                    width: 300,
                    collapsed: true,
                    body: {
                        view: "accordion",
                        rows: this._ui[what].map(function (el, ndx) {
                            if (ndx > 0) {
                                el.collapsed = true
                            }
                            return el;
                        })
                    }
                };
        },
        build: function () {
            var ui = {
                id: 'ui',
                multi: true,
                cols: []
            };

            if (this._ui.hasOwnProperty('left')) {
                ui.cols.push(this._build('left'));
                ui.cols.push({width: 5});
            }

            ui.cols.push({
                body: {
                    view: "tabview",
                    id: "main-tabview",
                    type: 'space',
                    padding: 0,
                    tabbar: {
                        height: 40,
                        popupWidth: 480,
                        tabMinWidth: TangoWebappPlatform.consts.NAME_COLUMN_WIDTH,
                        tabMoreWidth: 40,
                        bottomPadding: 5
                    },
                    cells: this._ui.main
                }
            });

            if (this._ui.hasOwnProperty('right')) {
                ui.cols.push({width: 5});
                ui.cols.push(this._build('right'));
            }

            webix.html.remove(document.getElementById('ajax-loader'));

            webix.ui(ui, $$('content'));
            webix.ui.fullScreen();
        }
    }
);
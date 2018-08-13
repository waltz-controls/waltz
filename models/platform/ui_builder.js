/**
 * Model ui_builder
 * @class
 * @type {UIBuilder}
 * @extends MVC.Model
 */
UIBuilder = MVC.Model.extend('ui_builder',
    /** @lends  UIBuilder */
    {

        attributes: {},
        default_attributes: {}
    },
    /** @lends  UIBuilder.prototype */
    {
        _ui: null,
        /**
         * @constructs
        */
        init: function () {
            this._ui = {
                _top: { maxHeight: 5 },
                main: [],
                _bottom: { maxHeight: 5 }
            };
        },

        _enable_left_sidebar: function () {
            this._ui['left'] = [];
        },
        _enable_right_sidebar: function () {
            this._ui['right'] = [];
        },
        /**
         * @param item
         */
        add_left_sidebar_item: function (item) {
            if (!this._ui.hasOwnProperty('left')) this._enable_left_sidebar();
            this._ui['left'].push(item);
        },
        /**
         * @param item
         */
        set_left_item: function (item) {
            this._set_left_item = true;
            this._ui['left'] = item;
        },
        add_right_sidebar_item: function (item) {
            if (!this._ui.hasOwnProperty('right')) this._enable_right_sidebar();
            this._ui['right'].push(item);
        },
        /**
         * @param item
         */
        set_right_item: function (item) {
            this._set_right_item = true;
            this._ui['right'] = item;
        },
        /**
         * @param item
         */
        add_mainview_item: function (item) {
            this._ui['main'].push(item);
        },
        /**
         *
         * @param {webix.config} top_toolbar
         */
        set_top_toolbar:function(top_toolbar){
            this._ui._top = top_toolbar;
        },
        /**
         *
         * @param {webix.config} bottom_toolbar
         */
        set_bottom_toolbar:function(bottom_toolbar){
            this._ui._bottom = bottom_toolbar;
        },
        _build: function (what) {
            if (this['_set_' + what + '_item']) return this._ui[what];
            else
                return {
                    header: '<span class="webix_icon fa-bars"></span>',
                    width: 300,
                    // collapsed: true,
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
        /**
         *
         */
        build: function () {
            var ui = {
                view: 'accordion',
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

            webix.ui({
                view: 'layout',
                id: 'main',
                type: 'space',
                rows: [
                    this._ui._top,
                    ui,
                    this._ui._bottom
                ]
            });
            webix.ui.fullScreen();
        }
    }
);
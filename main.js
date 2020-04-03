import { JetApp, EmptyRouter, HashRouter } from "node_modules/webix-jet/dist/es6/jet.js";

export default class MyApp extends JetApp{
    constructor(config){
        const defaults = {
            router: BUILD_AS_MODULE ? EmptyRouter : HashRouter,
            debug: !PRODUCTION,
            start: "/top/layout"
        };

        super({ ...defaults, ...config });
    }
}

new MyApp().render();
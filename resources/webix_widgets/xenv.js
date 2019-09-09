import {newXenvHqBody, xenvHqBottom, xenvHqSettings, xenvHqToolbar, xenvProfileSettings} from "./xenv_views.js"
import {ConfigurationManager, DataFormatServer, Profile, XenvServer} from "./xenv_models.js";

// if(MVC.env() === "test")
//     import("./xenv_test.js").then(module => bad_status = module.bad_status)

const kServers = ["HeadQuarter","ConfigurationManager","XenvManager","StatusServer2","DataFormatServer","CamelIntegration","PreExperimentDataCollector"];

const kServerFieldMap = {
    "HeadQuarter":"main",
    "ConfigurationManager":"configuration",
    "XenvManager":"manager",
    "StatusServer2":"status_server",
    "DataFormatServer":"data_format_server",
    "CamelIntegration":"camel",
    "PreExperimentDataCollector":"predator"
};


function newXenvSVGTab(){
    return {
        header: "<span class='webix_icon fa-map-o'></span> Xenv HQ SVG",
        borderless: true,
        body: TangoWebapp.ui.newSVGboard({id: 'hq-svg', svg:"Xenv.svg"})
    }
}

export function newTangoAttributeProxy(rest, host, device, attr) {
    return {
        $proxy: true,
        load(view, params) {
            view.clearAll();
            view.parse(rest.request().hosts(host).devices(device).attributes(attr).value().get()
                .then(value => JSON.parse(value.value))
                .catch(err => TangoWebappHelpers.error(err)));
        },
        save(view, params, dp) {
            //TODO
        },
        result() {

        }
    };
}

export const XenvHqController = class extends MVC.Controller {
    buildUI(platform_api) {
        // platform_api.ui_builder.add_mainview_item(newXenvSVGTab());
        platform_api.ui_builder.add_mainview_item(newXenvHeadQuarterTab());
    }
    /**
     *
     * @param {PlatformApi} platform_api
     */
    async initialize(platform_api){
        const $$hq = $$('hq');


        // const tango_host = await platform_api.context.rest.fetchHost("hzgxenvtest:10000");
        // $$hq.main = await tango_host.fetchDevice("development/hq/main");
        // $$hq.configurationManager = await tango_host.fetchDevice("development/hq/configuration");
        //
        // const camel = new XenvServer("Camel", "UNKNOWN", "UNKNOWN", "UNKNOWN", await tango_host.fetchDevice("test/camel/0"));
        // const predator = new XenvServer("PreExperimentDataCollector", "3.1", "UNKNOWN", "UNKNOWN", await tango_host.fetchDevice("test/predator/0"));
        // const data_format_server = new XenvServer("DataFormatServer", "3.1", "UNKNOWN", "UNKNOWN", await tango_host.fetchDevice("test/dfs/0"));
        // const status_server = new XenvServer("StatusServer", "3.1", "UNKNOWN", "UNKNOWN", await tango_host.fetchDevice("test/status_server/0"));
        //
        //
        // $$hq.$$('listServers').add(camel);
        // $$hq.$$('listServers').add(status_server);
        // $$hq.$$('listServers').add(data_format_server);
        // $$hq.$$('listServers').add(predator);
        //
        // $$('hq').$$('listDataSources').add(new DataSource("tango://hzgxenvtest:10000/sys/tg_test/1/double_scalar", "/entry/hardware/motor1","log","200","float64"));
        // $$('hq').$$('listDataSources').add(new DataSource("tango://hzgxenvtest:10000/sys/tg_test/1/long_scalar", "/entry/hardware/motor2","log","0","int64"));

        // $$hq.start();
    }
};

//disable Xenv widget for master
XenvHqController.initialize();

const xenvHq = webix.protoUI({
    name: "xenv-hq",
    async applySettings(){
        for(const server of kServers){
            if(this.$$(kServerFieldMap[server]).getValue()) {
                await this.dropDevice(this.$$(kServerFieldMap[server]).getValue());
            }
        }
    },
        /**
         *
         * @param {WidgetState} state
         */
    restoreState:async function(state){
        this.showProgress({
            type:"icon",
            icon:"refresh",
        });

        for(const server of kServers){
            if(state.data[server])
                await this.dropDevice(state.data[server]);
        }
            this.$$('main_tab').run();
        this.hideProgress();
        
        await this.loadProfiles();

        if(state.data.profile)
            this.$$('profiles').setValue(state.data.profile);
    },
    _ui:function(){
        return {
            rows:[
                xenvHqToolbar,
                xenvProfileSettings,
                xenvHqSettings,
                newXenvHqBody({
                    master: this,
                    configurationManager: this.configuration,
                    dataFormatServer: this.data_format_server
                }),
                xenvHqBottom
            ]
        }
    },
    async refreshProfiles(){
        await this.updateConfiguration();
        await this.loadProfiles();
        await this.selectProfile(this.$$('profiles').getValue());
    },
    async updateAndRestartAll(){
        if(!this.main) {
            TangoWebappHelpers.error("Can not perform action: main server has not been set!");
            return;
        }

        const stopAll = await this.main.device.fetchCommand("stopAll");
        const clearAll = await this.main.device.fetchCommand("clearAll");
        const updateAll = await this.main.device.fetchCommand("updateAll");
        const startAll = await this.main.device.fetchCommand("startAll");

        TangoWebapp.UserAction.executeCommand(stopAll)
        .then(() => TangoWebapp.UserAction.executeCommand(clearAll))
        .then(() => TangoWebapp.UserAction.executeCommand(updateAll))
        .then(() => TangoWebapp.UserAction.executeCommand(startAll));
    },
    async loadProfiles(){
        if(!this.configuration.device) {
            TangoWebappHelpers.error("Can not load profiles: configuration server has not been set!");
            return;
        }

        const profiles = await this.configuration.device.fetchAttr("profiles")
            .then(attr => attr.read())
            .catch(reason => TangoWebappHelpers.error("Can not load profiles", reason));

        this.$$('profiles').define({
            options : profiles.value.map(profile => new Profile(profile))
        });
        this.$$('profiles').refresh();
    },
    async createProfile(profile, tango_host, instance_name){
        const createProfile = await this.configuration.device.fetchCommand("createProfile");

        await TangoWebapp.UserAction.executeCommand(createProfile, [profile, tango_host, instance_name]);

        await this.loadProfiles();

        this.$$('profiles').setValue(profile);
    },
    async deleteProfile(profile){
        const deleteProfile = await this.configuration.device.fetchCommand("deleteProfile");

        await TangoWebapp.UserAction.executeCommand(deleteProfile, profile);

        this.$$('profiles').setValue(null);
        this.loadProfiles();
    },
    /**
     * Does nothing if profile is undefined
     *
     * @param {string|null} profile
     */
    async selectProfile(profile){
        this.$$('main_tab').clearAll();
        if(profile === null) {
            return;
        }
        if(!this.main.device) {
            TangoWebappHelpers.error("Can not select profile: main server has not been set!");
            return;
        }
        const load = await this.main.device.fetchCommand("load");

        TangoWebapp.UserAction.executeCommand(load, profile).then(async () => {
            const dataSourcesAttr = await this.configuration.device.fetchAttr("dataSources");
            const dataSources = await dataSourcesAttr.read();
            this.$$('main_tab').data.parse(dataSources.value.map(v => JSON.parse(v)));
        }).then(async () => {
            const attrs = await this.manager.device.fetchAttrValues(["tangoHost", "instanceName"]);

            this.$$('tango_host').setValue(attrs[0].value);
            this.$$('instance_name').setValue(attrs[1].value);
        })
        .then(() => {
            this.state.updateState({profile:profile});
        });
    },

    updateConfiguration:async function(){
        const updateCmd = await this.configuration.device.fetchCommand("update");

        TangoWebapp.UserAction.executeCommand(updateCmd);
    },
    commitConfiguration:async function(){
        const commitCmd = await this.configuration.device.fetchCommand("commit");

        TangoWebapp.UserAction.executeCommand(commitCmd,
            PlatformContext.UserContext.user
        );
    },
    pushConfiguration:async function(){
        const pushCmd = await this.configuration.device.fetchCommand("push");

        TangoWebapp.UserAction.executeCommand(pushCmd);
    },

        /**
         *
         * @param device_class
         * @return {*|undefined}
         */
        getServerByDeviceClass(device_class){
            return this.servers.find(server => server.name === device_class, true);
        },
        _init(config){
            this.servers = new webix.DataCollection({
                data: [
                    new XenvServer("HeadQuarter", undefined, "UNKNOWN", "Proxy is not initialized", null),
                    new XenvServer("XenvManager", undefined, "UNKNOWN", "Proxy is not initialized", null),
                    new ConfigurationManager(),
                    new XenvServer("StatusServer2", undefined, "UNKNOWN", "Proxy is not initialized", null),
                    new XenvServer("CamelIntegration", undefined, "UNKNOWN", "Proxy is not initialized", null),
                    new XenvServer("PreExperimentDataCollector", undefined, "UNKNOWN", "Proxy is not initialized", null),
                    new DataFormatServer()
                ]
            });
        },
        addStateAndStatusListeners: function (server) {
            PlatformContext.subscription.subscribe({
                    host: server.device.host.id,
                    device: server.device.name,
                    attribute: "status",
                    type: "change"
                },
                function (event) {
                    this.servers.updateItem(server.id, {
                        status: event.data
                    });
                    OpenAjax.hub.publish(`${server.name}.update.status`, event);
                }.bind(this),
                function (error) {
                    webix.message(error.data, "error")
                }.bind(this));

            PlatformContext.subscription.subscribe({
                    host: server.device.host.id,
                    device: server.device.name,
                    attribute: "state",
                    type: "change"
                },
                function (event) {
                    this.servers.updateItem(server.id, {
                        state: event.data
                    });
                    OpenAjax.hub.publish(`${server.name}.update.state`, event);
                }.bind(this),
                function (error) {
                    webix.message(error.data, "error")
                }.bind(this));
        },
        /**
         *
         * @param {string} id
         */
    async dropDevice(id){
        let device = TangoDevice.find_one(id);
        if(device == null) {
            try {
                const parts = id.split('/');
                const tango_host = parts.shift();
                device = await PlatformContext.rest.fetchHost(tango_host)
                    .then(host => host.fetchDevice(parts.join('/')))
            } catch (e) {
                TangoWebappHelpers.error(`Failed to fetch device[id=${id}]`,e);
                return;
            }
        }

        const device_class = device.info.device_class;

        const server = this.getServerByDeviceClass(device_class);

        if(server === undefined) return;

        this.servers.updateItem(server.id, {
            status: `Proxy has been set to ${device.id}`,
            ver: device.name,
            device
        });

        OpenAjax.hub.publish(`${server.name}.set.proxy`,{server});

        this.addStateAndStatusListeners(server);

        //update settings
        this.$$([kServerFieldMap[device_class]]).setValue(device.id);

        //update state
        const state = Object.create(null);
        state[device_class] = device.id;
        this.state.updateState(state);
    },
    get main(){
        return this.servers.find(server => server.name === "HeadQuarter",true);
    },
    get configuration(){
        return this.servers.find(server => server.name === "ConfigurationManager",true);
    },
    get manager(){
        return this.servers.find(server => server.name === "XenvManager",true);
    },
    get status_server(){
        return this.servers.find(server => server.name === "StatusServer2",true);
    },
    get camel(){
        return this.servers.find(server => server.name === "CamelIntegration",true);
    },
    get predator(){
        return this.servers.find(server => server.name === "PreExperimentDataCollector",true);
    },
    get data_format_server(){
        return this.servers.find(server => server.name === "DataFormatServer",true);
    },
    $init:function(config){
        this._init(config);

        webix.extend(config, this._ui());

        this.$ready.push(()=> {
            this.$$('main_tab').servers.data.sync(this.servers);
        });

        this.$ready.push(()=> {
            this.$$('profile').bind(this.$$('profiles'));
        });

        this.addDrop(this.getNode(),{
            /**
             * @function
             */
            $drop:function(source, target){
                var dnd = webix.DragControl.getContext();
                if(dnd.from.config.view === 'devices_tree_tree'){
                    this.dropDevice(dnd.source[0]);
                }

                return false;
            }.bind(this)
        });
    }
}, TangoWebappPlatform.mixin.Stateful, TangoWebappPlatform.mixin.OpenAjaxListener,
    webix.ProgressBar, webix.DragControl, webix.IdSpace,
    webix.ui.layout);

export function newXenvHeadQuarterTab(){
    return {
        header: "<span class='webix_icon fa-cubes'></span> Xenv HQ",
        borderless: true,
        body:
        {
            id: 'hq',
            view: "xenv-hq"
        }
    };
}


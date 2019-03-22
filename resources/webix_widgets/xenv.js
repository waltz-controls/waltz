import {xenvHqBody, xenvHqBottom, xenvHqSettings, xenvHqToolbar, xenvProfileSettings} from "./xenv_views.js"
import {DataSource, Profile, XenvServer} from "./xenv_models.js";

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

export const XenvHqController = class extends MVC.Controller {
    buildUI(platform_api) {
        platform_api.ui_builder.add_mainview_item(newXenvHeadQuarterTab())
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

XenvHqController.initialize();

const xenvHq = webix.protoUI({
    name: "xenv-hq",
    async applySettings(){
        this.$$('listServers').clearAll();
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
        await this.loadProfiles();

        if(state.data.profile)
            this.$$('profiles').setValue(state.data.profile);

        this.hideProgress();
    },
    _ui:function(){
        return {
            rows:[
                xenvHqToolbar,
                xenvProfileSettings,
                xenvHqSettings,
                xenvHqBody ,
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

        const stopAll = await this.main.fetchCommand("stopAll");
        const clearAll = await this.main.fetchCommand("clearAll");
        const updateAll = await this.main.fetchCommand("updateAll");
        const startAll = await this.main.fetchCommand("startAll");

        TangoWebapp.UserAction.executeCommand(stopAll)
        .then(() => TangoWebapp.UserAction.executeCommand(clearAll))
        .then(() => TangoWebapp.UserAction.executeCommand(updateAll))
        .then(() => TangoWebapp.UserAction.executeCommand(startAll));
    },
    async loadProfiles(){
        if(!this.configuration) {
            TangoWebappHelpers.error("Can not load profiles: configuration server has not been set!");
            return;
        }

        const profiles = await this.configuration.fetchAttr("profiles")
            .then(attr => attr.read())
            .catch(reason => TangoWebappHelpers.error("Can not load profiles", reason));

        this.$$('profiles').define({
            options : profiles.value.map(profile => new Profile(profile))
        });
        this.$$('profiles').refresh();
    },
    async createProfile(profile, tango_host, instance_name){
        const createProfile = await this.configuration.fetchCommand("createProfile");

        await TangoWebapp.UserAction.executeCommand(createProfile, [profile, tango_host, instance_name]);

        await this.loadProfiles();

        this.$$('profiles').setValue(profile);
    },
    async deleteProfile(profile){
        const deleteProfile = await this.configuration.fetchCommand("deleteProfile");

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
        if(profile === null) {
            this.$$('listDataSources').clearAll();
            this.$$('frmDataSource').clear();
            return;
        }
        if(!this.main) {
            TangoWebappHelpers.error("Can not select profile: main server has not been set!");
            return;
        }
        const load = await this.main.fetchCommand("load");

        TangoWebapp.UserAction.executeCommand(load, profile).then(async () => {
            const dataSourcesAttr = await this.configuration.fetchAttr("dataSources");
            const dataSources = await dataSourcesAttr.read();
            this.$$('frmDataSource').clear();
            this.$$('listDataSources').clearAll();
            this.$$('listDataSources').parse(dataSources.value.map(v => JSON.parse(v)));
        }).then(async () => {
            const attrs = await this.manager.fetchAttrValues(["tangoHost", "instanceName"]);

            this.$$('tango_host').setValue(attrs[0].value);
            this.$$('instance_name').setValue(attrs[1].value);
        })
        .then(() => {
            this.state.updateState({profile:profile});
        });
    },
    /**
     *
     * @param {DataSource} dataSource
     */
    addDataSource: async function(dataSource){
        const createDataSourceCmd = await this.configuration.fetchCommand("createDataSource");

        TangoWebapp.UserAction.executeCommand(createDataSourceCmd, [
            // PlatformContext.UserContext.user,
            dataSource.id,
            dataSource.nxPath,
            dataSource.type,
            dataSource.src,
            dataSource.pollRate,
            dataSource.dataType
        ]).then(() => this.commitConfiguration());
    },
    /**
     *
     * @param {DataSource} dataSource
     */
    removeDataSource: async function(dataSource){
        const deleteDataSourceCmd = await this.configuration.fetchCommand("removeDataSource");

        TangoWebapp.UserAction.executeCommand(deleteDataSourceCmd,
            dataSource.id
        ).then(() => this.commitConfiguration());
    },
    updateConfiguration:async function(){
        const updateCmd = await this.configuration.fetchCommand("update");

        TangoWebapp.UserAction.executeCommand(updateCmd);
    },
    commitConfiguration:async function(){
        const commitCmd = await this.configuration.fetchCommand("commit");

        TangoWebapp.UserAction.executeCommand(commitCmd,
            PlatformContext.UserContext.user
        );
    },
    pushConfiguration:async function(){
        const pushCmd = await this.configuration.fetchCommand("push");

        TangoWebapp.UserAction.executeCommand(pushCmd);
    },
    run:function(){
        TangoWebappPlatform.helpers.iterate(this.$$('listServers').data, (value, id) => {
            setTimeout(async function(){
                const state = await value.device.fetchAttr("State")
                    .then(state => state.read())
                    .then(value1 => value1.value)
                    .catch(() => "UNKNOWN");
                const status = await value.device.fetchAttr("Status")
                    .then(status => status.read())
                    .then(value1 => value1.value)
                    .catch(() => "UNKNOWN");
                this.$$('listServers').updateItem(id , {state: state, status: status});
            }.bind(this),0);
        });
    },
        /**
         *
         * @param {string} id
         */
    dropAttr(id){
        const attr = TangoAttribute.find_one(id);
        if(attr == null) return;

        const device = TangoDevice.find_one(attr.device_id);
        const $$list = this.$$('listDataSources');
        $$list.select(
            $$list.add(
                new DataSource(`tango://${attr.id}`,
                    `/entry/hardware/${device.name}/${attr.name}`,
                    "log",
                    200,
                    DataSource.devDataTypeToNexus(attr.info.data_type))));
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


        if(!kServers.includes(device_class)) return;

        const server = new XenvServer(device_class, device.name, "UNKNOWN", "UNKNOWN", device);
        this.$$('listServers').add(server);

        this[kServerFieldMap[device_class]] = device;
        this.$$([kServerFieldMap[device_class]]).setValue(device.id);

        const state = Object.create(null);
        state[device_class] = device.id;
        this.state.updateState(state);
    },
    $init:function(config){
        webix.extend(config, this._ui());

        this.$ready.push(()=> {
            this.$$('frmDataSource').bind(this.$$('listDataSources'));
            this.$$('profile').bind(this.$$('profiles'));
        });

        this.addDrop(this.getNode(),{
            /**
             * @function
             */
            $drop:function(source, target){
                var dnd = webix.DragControl.getContext();
                if(dnd.from.config.$id === 'attrs') {
                    this.dropAttr(dnd.source[0]);
                } else if(dnd.from.config.view === 'devices_tree_tree'){
                    this.dropDevice(dnd.source[0]);
                }

                return false;
            }.bind(this)
        });
    }
}, TangoWebappPlatform.mixin.Runnable, TangoWebappPlatform.mixin.Stateful, TangoWebappPlatform.mixin.OpenAjaxListener,
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


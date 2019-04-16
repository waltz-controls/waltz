/**
 * @module svg
 */
/**
 * @type {webix.protoUI}
 */
const svg = webix.protoUI(
    {
        name: 'svg',
        /**
         * @return {webix.ui}
         * @private
         */
        _ui:function(config){
            return {
                rows:[
                    {
                        template: `<object data='../../images/${config.svg}' type='image/svg+xml' id='alphasvg'></object>`
                    }
                ]
            }
        },
        initializePanZoom(){
            this.svg = svgPanZoom('#alphasvg', {
                zoomEnabled: true,
                controlIconsEnabled: true
            });

            this.svg.updateBBox();
            this.svg.center();
        },
        setViewPort(width, height){
            webix.assert(this.alphasvg != null,"svg must be not null at this point");
            this.alphasvg.setAttribute("width",width);
            this.alphasvg.setAttribute("height",height);
        },
        /**
         *
         * @param config
         * @constructor
         */
        $init:function(config){
            //extend client config with this widget's ui
            webix.extend(config, this._ui(config));
        },
        _process_devices(){
            const devices = $("[id|='device']", $(this.contentDocument));

            devices.each((ndx, el)=>{
                el.addEventListener("click",function(){
                    PlatformContext.loadAndSetDevice(el.id.substring(7));
                }, false);
            });
        },
        defaults:{
            on: {
                'platform_api.ui.initialized subscribe': function (data) {
                    webix.assert(document.getElementById("alphasvg") != null,"svg must be not null at this point");

                    this.alphasvg = document.getElementById("alphasvg");
                    this.alphasvg.addEventListener("load", () => {
                        console.log("svg loaded");

                        this.contentDocument = document.getElementById("alphasvg").contentDocument;
                        this.setViewPort(this.$width,this.$height);
                        this.initializePanZoom();

                        webix.event(window, "resize", ()=>{
                            this.setViewPort(this.$width,this.$height);
                            this.svg.resize();
                        });

                        this._process_devices();
                    });
                }},
        }
    }
    // webix.IdSpace is required to isolate ids within this component
    , TangoWebappPlatform.mixin.OpenAjaxListener, webix.IdSpace, webix.ui.layout);//this component extends webix layout -- an empty view

//this function will be available globally i.e. exports our dashboard
TangoWebapp.ui.newSVGboard = function(config){
    webix.assert(config.svg, "SVG must be set. SVG must be in images/ folder.");
    return webix.extend({
        view: 'svg'
    }, config);
};






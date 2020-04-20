const path = require("path");
const webpack = require("webpack");

module.exports = function(env) {

    const pack = require("./package.json");
    const MiniCssExtractPlugin = require("mini-css-extract-plugin");

    const production = !!(env && env.production === "true");
    const asmodule = !!(env && env.module === "true");
    const standalone = !!(env && env.standalone === "true");

    const babelSettings = {
        extends: path.join(__dirname, '/.babelrc')
    };

    const config = {
        mode: production ? "production" : "development",
        entry: {
            main: "./main.js"
        },
        output: {
            path: path.join(__dirname, "codebase"),
            publicPath:"/codebase/",
            filename: "[name].js",
            chunkFilename: "[name].bundle.js"
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    use: "babel-loader?" + JSON.stringify(babelSettings)
                },
                {
                    test: /\.(svg|png|jpg|gif)$/,
                    use: "url-loader?limit=25000"
                },
                {
                    test: /\.(less|css)$/,
                    use: [ MiniCssExtractPlugin.loader, "css-loader", "less-loader" ]
                },
                {
                    test: /webix\.js$/,
                    use: [ 'script-loader' ]
                }
            ]
        },
        stats:"minimal",
        resolve: {
            extensions: [".js"],
            modules: [".", "widgets", "node_modules"],
            alias:{
                "jet-views":path.resolve(__dirname, "sources/views"),
                "jet-locales":path.resolve(__dirname, "sources/locales")
            }
        },
        plugins: [
            new MiniCssExtractPlugin({
                filename:"[name].css"
            }),
            new webpack.DefinePlugin({
                VERSION: `"${pack.version}"`,
                APPNAME: `"${pack.name}"`,
                PRODUCTION : production,
                BUILD_AS_MODULE : (asmodule || standalone),
                REST_API_PROTOCOL: `"${env.REST_API_PROTOCOL}"`,
                REST_API_HOST : `"${env.REST_API_HOST}"`,
                REST_API_PORT : `${env.REST_API_PORT}`,
                REST_API_VERSION : `"${env.REST_API_VERSION}"`,
                TANGO_HOST : `"${env.TANGO_HOST}"`,
                TANGO_PORT : `${env.TANGO_PORT}`,
                USER_CONTEXT_URL : `"${env.USER_CONTEXT_URL}"`
            })
        ],
        devServer:{
            stats:"errors-only",
            proxy: {
                "/tango":{
                    target: 'http://localhost:10001'
                },
                "/user-context":{
                    target: 'http://localhost:3000'
                }
            }
        }
    };

    if (!production){
        config.devtool = "inline-source-map";
    }

    if (asmodule){
        if (!standalone){
            config.externals = config.externals || {};
            config.externals = [ "webix-jet" ];
        }

        const out = config.output;
        const sub = standalone ? "full" : "module";

        out.library = pack.name.replace(/[^a-z0-9]/gi, "");
        out.libraryTarget= "umd";
        out.path = path.join(__dirname, "dist", sub);
        out.publicPath = "/dist/"+sub+"/";
    }

    return config;
}
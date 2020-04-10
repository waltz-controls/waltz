var path = require("path");
var pack = require("./package.json");
var webpack = require("webpack");
var babelSettings = {
    extends: path.join(__dirname, "/.babelrc")
};

module.exports = {
    output: {
        // use absolute paths in sourcemaps (important for debugging via IDE)
        devtoolModuleFilenameTemplate: "[absolute-resource-path]",
        devtoolFallbackModuleFilenameTemplate: "[absolute-resource-path]?[hash]"
    },
    target: "node",  // webpack should compile node compatible code
    mode: "development",
    devtool: "inline-cheap-module-source-map",
    module: {
        rules: [
            {
                test: /\.js$/,
                loader: "babel-loader?" + JSON.stringify(babelSettings)
            },
            {
                test: /\.(svg|png|jpg|gif|less|css)$/,
                loader: "null-loader"
            }
        ]
    },
    resolve: {
        extensions: [".js"],
        modules: ["./sources", "node_modules"],
        alias:{
            "jet-views":path.resolve(__dirname, "sources/views"),
            "jet-locales":path.resolve(__dirname, "sources/locales")
        }
    },
    plugins: [
        new webpack.DefinePlugin({
            VERSION: `"${pack.version}"`,
            APPNAME: `"${pack.name}"`,
            PRODUCTION: false,
            BUILD_AS_MODULE: true
        })
    ]
};
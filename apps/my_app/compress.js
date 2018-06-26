//js apps/my_app/compress.js

MVCOptions = {
    onload: false,
    show_files: true,
    compress_callback: function (total) {
        var collected = MVCOptions.collect(total);
        MVCOptions.save('apps/my_app/collected.js', collected);
        print("Compiler output start >>>>>>");
        MVCOptions.compress('apps/my_app/collected.js', 'apps/my_app/production.js');
        print("<<<<<< Compiler output end.");
        MVCOptions.remove('apps/my_app/collected.js');
        print("Compressed to 'apps/my_app/production.js'.");

        MVCOptions.compress.apply(null,
            TangoWebappPlatform.ui._webix_files.map(function (webix_file) {
                return 'resources/webix_widgets/' + webix_file + '.js';
            }).concat(['apps/my_app/webix.js']));

        print("Compressed to 'apps/my_app/webix.js'.");
        quit();
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
window.location = 'apps/my_app/compress.html'; //<!-- IMPORTANT
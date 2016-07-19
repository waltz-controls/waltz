//js apps/tango_webapp/compress.js

MVCOptions = {
    onload: false,
    show_files: true,
    compress_callback: function(total){
        var collected = MVCOptions.collect(total);
        MVCOptions.save('apps/tango_webapp/collected.js', collected);
        print("Compiler output start >>>>>>");
        MVCOptions.compress('apps/tango_webapp/collected.js','apps/tango_webapp/production.js');
        print("<<<<<< Compiler output end.");
        MVCOptions.remove('apps/tango_webapp/collected.js');
        print("Compressed to 'apps/tango_webapp/production.js'.");
        load('jmvc/rhino/documentation/setup.js');
        
        var app = new MVC.Doc.Application(total, "tango_webapp");
        app.generate();
        print("Generated docs.");
        quit();
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
window.location = 'apps/tango_webapp/index.html';
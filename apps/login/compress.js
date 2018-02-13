//js apps/login/compress.js

MVCOptions = {
    onload: false,
    show_files: true,
    compress_callback: function(total){
        var collected = MVCOptions.collect(total);
        MVCOptions.save('apps/login/collected.js', collected);
        print("Compiler output start >>>>>>");
        MVCOptions.compress('apps/login/collected.js','apps/login/production.js');
        print("<<<<<< Compiler output end.");
        MVCOptions.remove('apps/login/collected.js');
        print("Compressed to 'apps/login/production.js'.");
        load('jmvc/rhino/documentation/setup.js');
        
        var app = new MVC.Doc.Application(total, "login");
        app.generate();
        print("Generated docs.");
        quit();
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
window.location = 'apps/login/compress.html';
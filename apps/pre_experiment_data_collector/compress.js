//js apps/pre_experiment_data_collector/compress.js

MVCOptions = {
    onload: false,
    show_files: true,
    compress_callback: function(total){
        var collected = MVCOptions.collect(total);
        MVCOptions.save('apps/pre_experiment_data_collector/collected.js', collected);
        print("Compiler output start >>>>>>");
        MVCOptions.compress('apps/pre_experiment_data_collector/collected.js','apps/pre_experiment_data_collector/production.js');
        print("<<<<<< Compiler output end.");
        MVCOptions.remove('apps/pre_experiment_data_collector/collected.js');
        print("Compressed to 'apps/pre_experiment_data_collector/production.js'.");
        load('jmvc/rhino/documentation/setup.js');
        
        var app = new MVC.Doc.Application(total, "pre_experiment_data_collector");
        app.generate();
        print("Generated docs.");
        quit();
    },
    env: "compress"
}
load('jmvc/rhino/compression/setup.js');
window.location = 'apps/pre_experiment_data_collector/index.html';
(function(){
    importClass(Packages.org.bitbucket.ingvord.jmvc.Compiler);
})();

/**
 *
 * @param path
 * @returns {boolean}
 */
MVCOptions.exists = function(path){
    var file = new java.io.File(path);
    return file.exists();
};

/**
 *
 * @param src what
 * @param dst where
 */
MVCOptions.copy = function(src, dst){
    var Files = java.nio.file.Files;
    var srcPath = java.nio.file.Paths.get(src);
    var trgPath = java.nio.file.Paths.get(dst);
    if(Files.isDirectory(trgPath)) trgPath = trgPath.resolve(srcPath.getFileName());
    Files.copy(srcPath,trgPath);
};

/**
 *
 * @param path
 * @param dst must be a directory if does not exist will be created
 */
MVCOptions.move = function(path, dst){
    var targetDir = new java.io.File(dst);
    if(!targetDir.exists()) targetDir.mkdirs();
    if(!targetDir.isDirectory()) throw "MVCOptions.move: dst must be a directory!";

    var file = new java.io.File(path);
    var targetFile = new java.io.File(targetDir.getAbsolutePath() + "/" + file.getName());
    if(targetFile.exists()) targetFile["delete"]();
    if(!file.renameTo(targetFile))
        throw "MVCOptions.move: move has failed: can not move " + file.getAbsolutePath() + " to "+ targetFile.getAbsolutePath()
};

/**
 * Creates all non existing parent directories.
 *
 * @param {string} path -- a path to a file
 * @param {string} src -- text to save in the file
 * @throw {string} if path is not a file
 */
MVCOptions.save = function(path, src){
    var Files = java.nio.file.Files;
    var Paths = java.nio.file.Paths;

    var path = Paths.get(path);
    if(Files.exists(path) && Files.isDirectory(path)) throw "IllegalArgument: path can not be a directory";

    var parent = path.getParent();
    Files.createDirectories(parent);

    var out = Files.newBufferedWriter(path,java.nio.charset.StandardCharsets.UTF_8),
            text = new java.lang.String( src || "" );
		out.write( text, 0, text.length() );
		out.flush();
		out.close();
};
MVCOptions.create_folder = function(path){
    var out = new java.io.File( path );
    out.mkdirs();
};

MVCOptions.remove = function(path){
    var file = new java.io.File( path );
    if(file.isDirectory()){
        var dir = file;
        var files = dir.listFiles();
        for(var i = 0, size = files.length; i < size ; ++i){
            MVCOptions.remove(files[i].getAbsolutePath());
        }
    }
    file["delete"]();
};

MVCOptions.compress = function(input_path,output_path){
    var args = java.lang.reflect.Array.newInstance(java.lang.String,4);
    args[0] = new java.lang.String("--js");
    args[1] = new java.lang.String(input_path);
    args[2] = new java.lang.String("--js_output_file");
    args[3] = new java.lang.String(output_path);

    var compressor = new Compiler(args);
    compressor.start();
};
MVCOptions.collect = function(total){
    var collection = '', txt;
	for(var s=0; s < total.length; s++){
		var includer = total[s];
        
        if(typeof includer == 'function'){
            collection += "include.next_function();\n"
        }else{
            txt = includer.process ? includer.process(includer) : includer.text
		    collection += "include.set_path('"+includer.start+"')"+";\n"+txt + ";\n";
        }
        
        
	}
	collection += "include.end_of_production();";
    return collection;
};


MVCOptions.collect_and_compress = function(total){
    var collection = '', script, txt, compressed;
	for(var s=0; s < total.length; s++){
		script = total[s];
        if(typeof script == 'function'){
            collection += "include.next_function();\n"
        }else{
            txt = script.process ? script.process(total[s]) : script.text;
    		compressed = script.compress == false ? txt : MVCOptions.compress(txt, script.path);
            collection += "include.set_path('"+script.start+"')"+";\n"+compressed + ";\n";
            
            
        }
	}
	collection += "include.end_of_production();";
    return collection;
}


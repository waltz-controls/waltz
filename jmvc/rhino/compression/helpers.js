var imports = new JavaImporter(java.io,java.nio.file,org.bitbucket.ingvord.jmvc);

with(imports) {
    /**
     *
     * @param path
     * @returns {boolean}
     */
    MVCOptions.exists = function (path) {
        var file = new File(path);
        return file.exists();
    };

    /**
     *
     * @param src what
     * @param dst where
     */
    MVCOptions.copy = function (src, dst) {
        var srcPath = Paths.get(src);
        var trgPath = Paths.get(dst);
        if (Files.isDirectory(trgPath)) trgPath = trgPath.resolve(srcPath.getFileName());
        Files.copy(srcPath, trgPath);
    };

    /**
     *
     * @param path
     * @param dst must be a directory if does not exist will be created
     */
    MVCOptions.move = function (path, dst) {
        var targetDir = new File(dst);
        if (!targetDir.exists()) targetDir.mkdirs();
        if (!targetDir.isDirectory()) throw "MVCOptions.move: dst must be a directory!";

        var file = new File(path);
        var targetFile = new File(targetDir.getAbsolutePath() + "/" + file.getName());
        if (targetFile.exists()) targetFile["delete"]();
        if (!file.renameTo(targetFile))
            throw "MVCOptions.move: move has failed: can not move " + file.getAbsolutePath() + " to " + targetFile.getAbsolutePath()
    };

    /**
     * Creates all non existing parent directories.
     *
     * @param {string} path -- a path to a file
     * @param {string} src -- text to save in the file
     * @throw {string} if path is not a file
     */
    MVCOptions.save = function (path, src) {
        var path = Paths.get(path);
        if (Files.exists(path) && Files.isDirectory(path)) throw "IllegalArgument: path can not be a directory";

        var parent = path.getParent();
        Files.createDirectories(parent);

        var out = Files.newBufferedWriter(path, java.nio.charset.StandardCharsets.UTF_8),
            text = new java.lang.String(src || "");
        out.write(text, 0, text.length());
        out.flush();
        out.close();
    };
    MVCOptions.create_folder = function (path) {
        var out = new File(path);
        out.mkdirs();
    };

    MVCOptions.remove = function (path) {
        var file = new File(path);
        if (file.isDirectory()) {
            var dir = file;
            var files = dir.listFiles();
            for (var i = 0, size = files.length; i < size; ++i) {
                MVCOptions.remove(files[i].getAbsolutePath());
            }
        }
        file["delete"]();
    };

    MVCOptions.compress = function (input_path, output_path) {
        var Compiler = Java.type("org.bitbucket.ingvord.jmvc.Compiler");
        var Array = Java.type("java.lang.reflect.Array");
        var JString = Java.type("java.lang.String");

        var args = Array.newInstance(JString.class, 4);
        args[0] = new JString("--js");
        args[1] = new JString(input_path);
        args[2] = new JString("--js_output_file");
        args[3] = new JString(output_path);

        var compressor = new Compiler(args);
        compressor.start();
    };
    MVCOptions.collect = function (total) {
        var collection = '', txt;
        for (var s = 0; s < total.length; s++) {
            var includer = total[s];

            if (typeof includer == 'function') {
                collection += "include.next_function();\n"
            } else {
                txt = includer.process ? includer.process(includer) : includer.text
                collection += "include.set_path('" + includer.start + "')" + ";\n" + txt + ";\n";
            }


        }
        collection += "include.end_of_production();";
        return collection;
    };


    MVCOptions.collect_and_compress = function (total) {
        var collection = '', script, txt, compressed;
        for (var s = 0; s < total.length; s++) {
            script = total[s];
            if (typeof script == 'function') {
                collection += "include.next_function();\n"
            } else {
                txt = script.process ? script.process(total[s]) : script.text;
                compressed = script.compress == false ? txt : MVCOptions.compress(txt, script.path);
                collection += "include.set_path('" + script.start + "')" + ";\n" + compressed + ";\n";


            }
        }
        collection += "include.end_of_production();";
        return collection;
    }
}


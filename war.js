const fs = require("fs");
const archiver = require("archiver");

fs.mkdirSync(__dirname + "/dist");

const out = `${__dirname}/dist/${process.argv[2]}.war`;

const output = fs.createWriteStream(out);
const archive = archiver("zip", {});

output.on("finish", () => {
    console.log("war (" + out + ") " + archive.pointer() + " total bytes");
});

archive.pipe(output);

archive.directory("apps/", "apps");
archive.directory("codebase/", "codebase");
archive.directory("controlles/", "controlles");
archive.directory("images/", "images");
archive.directory("models/", "models");
archive.directory("resources/", "resources");
archive.file("index.html");
archive.file("jmvc/include.js");

archive.finalize();
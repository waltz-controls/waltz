/*  This is a port to JavaScript of Rail's plugin functionality.  It uses the following
 * license:
 *  This is Free Software, copyright 2005 by Ryan Tomayko (rtomayko@gmail.com) 
     and is licensed MIT: (http://www.opensource.org/licenses/mit-license.php)
 */
function readUrl(url) {
    // Using JavaImporter to resolve classes
    // from specified java packages within the
    // 'with' statement below

    with (new JavaImporter(java.io, java.net)) {
        // more or less regular java code except for static types
        var is = new URL(url).openStream();
        try {
            var reader = new BufferedReader(
                new InputStreamReader(is));
            var buf = '', line = null;
            while ((line = reader.readLine()) != null) {
                buf += line;
            }
        } finally {
            reader.close();
        }
        return buf;
    }
}


/**
 * This is tightly bound with bitbucket.org rest API v. 1.0
 *
 * @param urls_to_fetch bitbucket rest api URL, i.e. https://bitbucket.org/api/1.0/repositories/...
 * @param level -1 or 0. Zero preserves folders structure, -1 -- skips one level
 * @param cwd current working directory (on local box), this defines where to download files
 * @param ignore a file name pattern to ignore, or false if nothing should be ignored
 * @param download_url bitbucket raw URL, i.e. https://bitbucket.org/{owner}/{repo}/raw/default/...
 * @constructor
 */
RecursiveHTTPFetcher = function(urls_to_fetch, level, cwd, ignore, download_url){
    this.urls_to_fetch = [urls_to_fetch];
    this.download_url = download_url;
    this.level = level || 1
    this.cwd = cwd || "."
    this.quite =false
    this.ignore = ignore;
}
RecursiveHTTPFetcher.prototype = {
    push_d: function(dir){
        this.cwd = (new MVC.File(this.cwd)).join(dir);
        new MVC.File( this.cwd ).mkdir()
    },
    pop_d: function(){
        this.cwd = new MVC.File(this.cwd).dir();
    },
    download : function(link){
        //var text = readUrl( link);

        var bn = new MVC.File(link).basename();
        var f = new MVC.File(this.cwd).join(bn);
        if(f.match(this.ignore)){
            print("   I "+f);
            return;
        }
        
        var oldsrc = null;
        try {
            oldsrc = readFile(f);
        }catch(ignored){}

        new MVC.File(f).download_from( link, true );
        var newsrc = readFully(f);
        var p = "   "
        if(oldsrc){
            if(oldsrc == newsrc)
                print(p+"= "+f);
            else
                print(p+"U "+f);
        }else{
            print(p+"A "+f);
        }
    },
    fetch : function(links ){
        links = links || this.urls_to_fetch;
        links.forEach(function(link){
            var contents = readUrl(link);
            var parsed = JSONparse(contents);

            var files = parsed.files;
            files.forEach(function(file){
                var link_to_file = this.download_url + '/' + file.path;
                this.download(link_to_file);
            },this);
            var dirs = parsed.directories;
            dirs.forEach(function(dirName){
                var link_to_dir = link + dirName + '/';
                this.fetch_dir(link_to_dir, dirName)
            },this);
        },this);
    },
    fetch_dir : function(url, dir){
        this.level++;
        if(this.level > 0) this.push_d( dir );
        
        this.fetch([url]);
        if(this.level > 0) this.pop_d();
        this.level --;
    }
    
}
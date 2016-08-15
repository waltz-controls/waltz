# README #

This project is an attempt to implement Tango Controls Roadmap [Feature Request #6](http://www.tango-controls.org/community/roadmap/)

## Requirements ##

* Tango Controls environment (tested on Tango 8 and Tango 9)
* Tango REST Server that supports API spec version at least rc3 (tested on mtango.server-rc3-0.1)
* Web server that can handle .war files (tested on Apache Tomcat 8)

## Build ##

This project uses gradle for high level build operations. Supported tasks are:

```
Build tasks
-----------
clean - Deletes the build directory.
prepareBuild - creates build's skeleton
compress - compresses JavaScript
prepareWar - archives build into a .war file
deploy - deploys generated .war file to the downloads page 
```

## Implementation details ##

* [JavaScriptMVC-1.5.x](https://bitbucket.org/Ingvord/javascriptmvc-1.5.x) is used for MVC implementation
* [Webix-3.4](http://webix.com) is used for UI
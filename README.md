[![](images/logo_Waltz_small.png)](http://www.waltz-controls.space/?badge=latest)


[![logo](http://www.tango-controls.org/static/tango/img/logo_tangocontrols.png)](http://www.tango-controls.org) 


[![Codacy Badge](https://api.codacy.com/project/badge/Grade/512287ad5da94ac7af157a94eec80c5a)](https://www.codacy.com/app/tango-controls/tango-webapp?utm_source=github.com&amp;utm_medium=referral&amp;utm_content=tango-controls/tango-webapp&amp;utm_campaign=Badge_Grade)
[![codebeat badge](https://codebeat.co/badges/23388ba2-feda-479d-a8c8-abf68eb7b01a)](https://codebeat.co/projects/github-com-tango-controls-tango-webapp-master)
[![Build Status](https://travis-ci.org/tango-controls/waltz.svg?branch=master)](https://travis-ci.org/tango-controls/waltz)

[![Docs](https://img.shields.io/badge/Generated-Docs-green.svg)](https://tango-controls.github.io/waltz/)
[![Documentation Status](https://readthedocs.org/projects/waltz-docs/badge/?version=latest)](http://www.waltz-controls.space?badge=latest)

[![release](https://img.shields.io/github/release/tango-controls/tango-webapp.svg?style=flat)](https://github.com/tango-controls/tango-webapp/releases/latest)

This project is an attempt to implement Tango Controls Roadmap Feature Request #6, see [Tango Controls Roadmap](http://www.tango-controls.org/about-us/feature-requests/)

## SonarCloud

[![Quality gate](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=alert_status)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)

[![Maintainability](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=sqale_rating)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)
[![Reliability](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=reliability_rating)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)
[![Security](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=security_rating)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)

[![Lines Of Code](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=ncloc)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)
[![Technical debt](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=sqale_index)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)
[![Duplicate lines](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=duplicated_lines_density)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)

[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=bugs)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=vulnerabilities)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)
[![Code smells](https://sonarcloud.io/api/project_badges/measure?project=org.tango-controls%3ATangoWebapp&metric=code_smells)](https://sonarcloud.io/dashboard?id=org.tango-controls%3ATangoWebapp)

# Documentation

[Waltz User/Developer guides](http://www.waltz-controls.space/?badge=latest)
 
[WaltzPlatform API reference](https://tango-controls.github.io/waltz/)

## Other useful resources

### Videos

[1] [UI and features presentation](https://vimeo.com/268669625)

[2] [Tech stack presentation: TangoWebapp + Tango REST + Tango Controls](https://rutube.ru/video/00d518e2aa8958b891430fbdf24f270a/)

### Slides

[1] [TangoWebapp Insights, 32 Tango Users meeting, 2018](https://www.slideshare.net/IgorKhokhryakov/tangowebapp-insights)

## Live demo

To run the live demo click on the image 

User: tango-cs
Pass: tango

[![](https://github.com/tango-controls/tango-webapp/wiki/images/live.png)](http://ec2-35-156-104-8.eu-central-1.compute.amazonaws.com:8080/master/)

## Getting started ##

1. Execute `docker-copmpose.yml` using [`docker-compose`](https://docs.docker.com/compose/install/) i.e. `docker-compose up`
2. Open browser and navigate to `http://localhost:8080/waltz`
3. Login using tango-cs/tango
4. Explore Tango Controls via Waltz...

## Developer requirements ##

* Tango Controls environment (tested on Tango 8 and Tango 9)
* Tango REST Server that supports API spec version rc4 (tested on [rest-server-1.6](https://github.com/tango-controls/rest-server/releases/tag/rest-server-1.6))
* Web server that can handle .war files (tested on Apache Tomcat 8&9)

## Build ##

This project uses jmvcc for high level build operations:

```bash
$> ./jmvcc jmvc/clean
$> REST_API_PROTOCOL=[http|https] REST_API_HOST=[localhost] REST_API_PORT=[10001]  \
   TANGO_HOST=[localhost] TANGO_PORT=10000 \
   ./jmvcc jmvc/assemble
```

This requires jjs to be in the $PATH (is shipped with OpenJDK8 and later)

## Implementation details

* [JavaScriptMVC-1.5.x](https://bitbucket.org/Ingvord/javascriptmvc-1.5.x) is used for MVC implementation
* [Webix](http://webix.com) is used for UI
* [CodeMirror](https://codemirror.net/) is used for scripting console
* [Plotly](https://plot.ly/javascript/) is used to display plots and images

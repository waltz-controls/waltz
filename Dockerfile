FROM tomcat:9-jdk11

COPY dist/waltz.war /usr/local/tomcat/webapps


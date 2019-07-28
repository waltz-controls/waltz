FROM tomcat:9-jdk8

COPY build/distributions/waltz.war /usr/local/tomcat/webapps


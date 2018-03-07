#!/bin/bash

REST_API_PROTOCOL = "http";
REST_API_HOST = "ec2-35-156-104-8.eu-central-1.compute.amazonaws.com";
REST_API_PORT = 8080;
REST_API_VERSION = "rc4";
TANGO_HOST = "ip-172-31-30-179";
TANGO_PORT = 10000;

./jmvcc jmvc/clean

./jmvcc jmvc/assemble

#decrypt
openssl aes-256-cbc -K $encrypted_2f30ea6ab509_key -iv $encrypted_2f30ea6ab509_iv -in ./.travis/IngvordESRF.pem.enc -out ./.travis/IngvordESRF.pem -d

scp -i ./.travis/IngvordESRF.pem build/distributions/TangoWebapp.war ubuntu@$REST_API_HOST:/home/ubuntu

ssh -i ./.travis/IngvordESRF.pem ubuntu@$REST_API_HOST "sudo mv /home/ubuntu/TangoWebapp.war /var/lib/tomcat8/webapps"
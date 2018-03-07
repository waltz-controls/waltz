#!/bin/bash

export REST_API_PROTOCOL="http";
export REST_API_HOST="ec2-35-156-104-8.eu-central-1.compute.amazonaws.com";
export REST_API_PORT=8080;
export REST_API_VERSION="rc4";
export TANGO_HOST="ip-172-31-30-179";
export TANGO_PORT=10000;

./jmvcc jmvc/clean

./jmvcc jmvc/assemble

#decrypt
openssl aes-256-cbc -K $encrypted_2f30ea6ab509_key -iv $encrypted_2f30ea6ab509_iv -in ./.travis/IngvordESRF.pem.enc -out ./.travis/IngvordESRF.pem -d

ssh -o "StrictHostKeyChecking no" $REST_API_HOST

scp -v -i ./.travis/IngvordESRF.pem build/distributions/TangoWebapp.war ubuntu@$REST_API_HOST:/home/ubuntu

ssh -v -i ./.travis/IngvordESRF.pem ubuntu@$REST_API_HOST "sudo mv /home/ubuntu/TangoWebapp.war /var/lib/tomcat8/webapps"
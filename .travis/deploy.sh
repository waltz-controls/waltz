#!/bin/bash

#decrypt
#openssl aes-256-cbc -pass pass:$super_secret_password -in ./.travis/IngvordAWS.pem.enc -out ./.travis/IngvordAWS.pem -d
openssl aes-256-cbc -K $encrypted_c93bb15937a9_key -iv $encrypted_c93bb15937a9_iv -in IngvordAWS.pem.enc -out IngvordAWS.pem -d

chmod 600 ./.travis/IngvordAWS.pem

ssh -o "StrictHostKeyChecking no" $REST_API_HOST

scp -v -i ./.travis/IngvordAWS.pem build/distributions/$TRAVIS_BRANCH.war ubuntu@$REST_API_HOST:/home/ubuntu

ssh -v -i ./.travis/IngvordAWS.pem ubuntu@$REST_API_HOST "sudo mv /home/ubuntu/$TRAVIS_BRANCH.war /var/lib/tomcat9/webapps"

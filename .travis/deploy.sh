#!/bin/bash

. ./.travis/.env.amazon

#decrypt
openssl aes-256-cbc -K $encrypted_2f30ea6ab509_key -iv $encrypted_2f30ea6ab509_iv -in ./.travis/IngvordESRF.pem.enc -out ./.travis/IngvordESRF.pem -d

chmod 600 ./.travis/IngvordESRF.pem

ssh -o "StrictHostKeyChecking no" $REST_API_HOST

scp -v -i ./.travis/IngvordESRF.pem build/distributions/$TRAVIS_BRANCH.war ubuntu@$REST_API_HOST:/home/ubuntu

ssh -v -i ./.travis/IngvordESRF.pem ubuntu@$REST_API_HOST "sudo mv /home/ubuntu/$TRAVIS_BRANCH.war /var/lib/tomcat8/webapps"
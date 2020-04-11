#!/bin/bash

npm run build
npm run war
test -e dist/waltz.war
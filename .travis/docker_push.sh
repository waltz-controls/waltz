#!/bin/bash

set -e

DOCKER_TAG=$1

docker build --pull --tag "tangocs/waltz" .

docker tag "tangocs/waltz" "tangocs/waltz:${DOCKER_TAG}"

docker push "tangocs/waltz:${DOCKER_TAG}"
#!/bin/bash

DOCKER_TAG=$1

docker tag "$DOCKER_IMAGE_NAME" "${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"

docker push "${DOCKER_IMAGE_NAME}:${DOCKER_TAG}"
#!/bin/bash

set -ex

pushd docker

docker-compose build && \
docker-compose down && \
docker-compose up -d --remove-orphans

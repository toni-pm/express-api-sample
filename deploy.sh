#!/bin/bash

# Toni Peraira <toniperairam@gmail.com>

docker kill tpmcomponents 2> /dev/null
docker rm tpmcomponents 2> /dev/null

docker run \
        --name tpmcomponents \
        --restart always \
        -p 3000:3000 \
        --env-file ./.env \
        -d tpmcomponents
FROM node:0.10-onbuild

RUN apt-get update -y && apt-get install -y pngcrush

COPY . /data
ENTRYPOINT node /data/proxy.js

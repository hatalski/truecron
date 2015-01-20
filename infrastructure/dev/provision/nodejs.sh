#!/usr/bin/env bash

add-apt-repository -y ppa:chris-lea/node.js
apt-get update
apt-get -y install nodejs
npm install npm -g
npm install -g supervisor

#dependencies for hellocron app
npm install -g minimist

#end of file
#!/usr/bin/env bash

# https://nodesource.com/blog/nodejs-v012-iojs-and-the-nodesource-linux-repositories
# Note the new setup script name for Node.js v0.12
curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
# Then install with:
apt-get install -y nodejs

npm install npm -g
npm install -g supervisor

#end of file
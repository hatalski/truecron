#!/usr/bin/env bash
bash /vagrant/provision/default.sh

mkdir /var/log/node/
chown vagrant:vagrant /var/log/node/

add-apt-repository -y ppa:chris-lea/node.js
apt-get update
apt-get -y install nodejs=0.10.30-1chl1~trusty1
npm install npm -g
npm install -g supervisor

#dependencies for hellocron app
npm install -g minimist

#dependencies for truecron express app
cd /vagrant
npm install
npm update
npm start

#end of file
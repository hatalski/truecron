#!/usr/bin/env bash

apt-get -y install daemon
daemon --name debugproxy -v -- node /vagrant/debugproxy.js

#end of file

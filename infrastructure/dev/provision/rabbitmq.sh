#!/usr/bin/env bash
apt-get -y install rabbitmq-server

# enable web UI for management and monitoring. Use http://192.168.3.10:15672 and guest/guest.
rabbitmq-plugins enable rabbitmq_management
service rabbitmq-server restart

npm install amqplib -y

#!/usr/bin/env bash

apt-get -y install postgresql-9.3 
apt-get -y install pgbouncer
#create user and database with the name of default user "vagrant"
sudo -u postgres createuser vagrant -s -d -r -l
sudo -u vagrant createdb vagrant

#allow access from the other virtual
tmpfile=/tmp/postgresql.conf.tmp
cat /etc/postgresql/9.3/main/postgresql.conf | grep -v "listen_addresses = '*'" > $tmpfile
echo "listen_addresses = '*'" >> $tmpfile
cp /tmp/postgresql.conf.tmp /etc/postgresql/9.3/main/postgresql.conf

tmpfile=/tmp/pg_hba.conf.tmp
cat /etc/postgresql/9.3/main/pg_hba.conf | grep -v "host all all 192.168.3.0 255.255.255.0 trust" > $tmpfile
echo "host all all 192.168.3.0 255.255.255.0 trust" >> $tmpfile
cp /tmp/pg_hba.conf.tmp /etc/postgresql/9.3/main/pg_hba.conf

service postgresql restart

#end of file
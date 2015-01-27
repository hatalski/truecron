#!/usr/bin/env bash

mkdir /var/www
chown vagrant:vagrant /var/www -R

#dependencies for truecron express app
# dv: we don't need it anymore as we inject all dependencies to our repo
#npm install --no-bin-links
#npm update --no-bin-links

#all client-side libraries for truecron app
# dv: we don't need it anymore as we inject all dependencies to our repo
#bower install --allow-root

#end of file
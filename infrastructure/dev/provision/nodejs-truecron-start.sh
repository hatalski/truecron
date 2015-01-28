#!/usr/bin/env bash

if [ -d "/var/www/truecron/server" ]; then
    cd /var/www/truecron/server; npm start
else
    echo "


    ===========================================================================================
    Please check vagrant/dev/README.md how to setup your WebStorm to work with TrueCron project
    ===========================================================================================
    "
fi

#end of file
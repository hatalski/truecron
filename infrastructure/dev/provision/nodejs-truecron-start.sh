#!/usr/bin/env bash

if [ -d "/var/www/truecron" ]; then
    cd /var/www/truecron; npm start
else
    echo "


    ===========================================================================================
    Please check vagrant/dev/README.md how to setup your WebStorm to work with TrueCron project
    ===========================================================================================
    "
fi

#end of file
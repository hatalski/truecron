TrueCron
========

Scalable Cloud Scheduler


Configuration

An order in which environment variables are loaded is the following:
1. load nconf.defaults values here: https://github.com/PerksLab/truecron/blob/master/lib/config.js
2. load values from environment configuration file (for staging it is: https://github.com/PerksLab/truecron/blob/master/config/staging.json)
3. load AWS UI variables

so if something is different from what you have specified in config file it means that this value was overloaded on AWS UI

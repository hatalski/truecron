TrueCron
========

Scalable Cloud Scheduler

[ ![Codeship Status for PerksLab/truecron](https://www.codeship.io/projects/842a54c0-2bb3-0132-355f-3e0c7cea2035/status)](https://www.codeship.io/projects/38645)

Configuration
--------

An order in which environment variables are loaded is the following:

1. load nconf.defaults values here: https://github.com/PerksLab/truecron/blob/master/lib/config.js
2. load values from environment configuration file  
  (for staging it is: https://github.com/PerksLab/truecron/blob/master/config/staging.json)
3. load AWS UI variables

so if something is different from what you have specified in config file it means that this value was overloaded on AWS UI

Vagrant
=======

Install
-------

###Required software

Download and install Vagrand and VirualBox:

    http://www.vagrantup.com/downloads
    https://www.virtualbox.org/wiki/Downloads


Check your installation by run from command line or from Start -> Run menu:

    VBoxManage
    vagrant

If something wrong please check your PATH environment.

###Setting up project directory

It is highly recommended to create project dir TrueCron anywhere on your PC. All following commands will be relative to this directory.

###Setting up vagrant

We will work with Ubuntu Server so we should download ubuntu box:

    vagrant box add ubuntu/trusty64
    git clone git@github.com:PerksLab/truecron.git
  
It will take for about 2-10 minutes depends on your internenet connection. 

###Starting virtual environment

Now we are ready to set up our local dev environment. Please see instruction [Dev](/dev/README.md).

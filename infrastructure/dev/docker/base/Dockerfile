FROM ubuntu:trusty
MAINTAINER Vitali Hatalski <vhatalski@naviam.com>

ENV HOME /home

# Add apt repository needed
RUN echo 'deb http://archive.ubuntu.com/ubuntu trusty main universe' > /etc/apt/sources.list  && \
    echo 'deb http://archive.ubuntu.com/ubuntu trusty-security main universe' >> /etc/apt/sources.list && \
    echo 'deb http://archive.ubuntu.com/ubuntu trusty-updates main universe' >> /etc/apt/sources.list && \
    echo 'deb http://archive.ubuntu.com/ubuntu trusty-backports main restricted universe multiverse' >> /etc/apt/sources.list && \
    echo 'deb-src http://archive.ubuntu.com/ubuntu trusty main universe' >> /etc/apt/sources.list && \
    echo 'deb-src http://archive.ubuntu.com/ubuntu trusty-security main universe' >> /etc/apt/sources.list && \
    echo 'deb-src http://archive.ubuntu.com/ubuntu trusty-updates main universe' >> /etc/apt/sources.list && \
    echo 'deb-src http://archive.ubuntu.com/ubuntu trusty-backports main restricted universe multiverse' >> /etc/apt/sources.list && \
    mkdir -p $HOME && \
    apt-get update && \
    apt-get install -y python-software-properties python-pip git curl wget sudo socat && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# ADD TrueCron User
RUN addgroup --gid=1000 truecron && \
    adduser --system --uid=1000 --home /home --shell /bin/bash truecron && \
    echo "truecron ALL=(ALL) NOPASSWD: ALL" >> /etc/sudoers && \
    chown -R truecron:truecron /home && \
    chown -R truecron:truecron /usr/local

USER truecron
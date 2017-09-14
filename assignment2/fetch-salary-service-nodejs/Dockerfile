FROM ubuntu:16.04
MAINTAINER "kr.satyam.ind@gmail.com"
ADD . /nodedir
EXPOSE 3000

# Create app directory
WORKDIR /nodedir

RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
RUN apt-get -y install npm

RUN npm -v 
RUN apt-get -y install nodejs-legacy

RUN npm install express && npm install mysql && npm install amqplib


RUN chmod 777 sleep.sh

RUN ./sleep.sh

CMD node server.js

# Install app dependencies
#COPY package.json .


# For npm@5 or later, copy package-lock.json as well
# COPY package.json package-lock.json ./



# Bundle app source
#COPY . .




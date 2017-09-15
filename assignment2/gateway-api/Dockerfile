#MAINTAINER "kr.satyam.ind@gmail.com"
#ADD . /nodedir
#EXPOSE 9999

# Create app directory
#WORKDIR /nodedir

#RUN apt-get update
#RUN apt-get -y install npm
#RUN npm install -g npm

#RUN npm -v 
#RUN apt-get -y install nodejs-legacy

#RUN npm install express && npm install mysql && npm install amqplib && npm install body-parser


#RUN chmod 777 sleep.sh

#RUN ./sleep.sh

#CMD node gateway.js



FROM node:7
ADD . /nodedir
WORKDIR /nodedir
RUN npm install express && npm install mysql && npm install amqplib && npm install body-parser
CMD node gateway.js
EXPOSE 9999

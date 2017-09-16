FROM node:7
ADD . /nodedir
WORKDIR /nodedir
RUN apt-get update
RUN npm install express && npm install mysql && npm install amqplib 
RUN npm install forever -g
CMD node server.js
EXPOSE 3000

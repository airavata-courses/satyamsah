FROM node:7
ADD . /nodedir
WORKDIR /nodedir
RUN chmod 777 build.sh
CMD ["bash", "build.sh"]
RUN apt-get update
RUN sleep 5
RUN npm install express && npm install mysql && npm install amqplib && npm install body-parser
RUN npm install forever -g
CMD node gateway.js
EXPOSE 9999

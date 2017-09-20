#!/bin/bash

# Inspired by Jeffry, IUB
echo -------------Build started-------------
echo IN::$PWD;
# Delete all containers
docker rm -f $(docker ps -a -q) || echo No Docker images
# Delete all images
docker rmi -f $(docker images -q) || echo No Docker containers
sudo docker run --name webui-container --hostname webui-container -p 8090:8090 satyamsah/web-interface-image
sudo docker run --name mysql-container --hostname mysql-container -e MYSQL_ROOT_PASSWORD=root123 -d satyamsah/mysql
sudo docker run -d --name rmq-container --hostname rmq-container --name rmq-container rabbitmq:3
sudo docker run --name create-emp-container --hostname create-emp-container -p 9090:9090 --link rmq-container --link mysql-container satyamsah/employee-onboard-image
sudo docker run --name create-salaryslab-container --hostname create-salaryslab-container --link mysql-container satyamsah/create-salaryslab-image
sudo docker run --name api-gateway-container --hostname api-gateway-container -p 9999:9999 satyamsah/gateway-image
sudo docker run --name fetch-salary-container --hostname fetch-salary-container -p 3000:3000 --link rmq-container --link mysql-container satyamsah/fetch-salary-image

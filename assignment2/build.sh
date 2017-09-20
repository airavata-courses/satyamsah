#!/bin/bash

# Inspired by Jeffry, IUB
echo -------------Build started-------------
echo IN::$PWD;
# Delete all containers
sudo docker rm -f $(sudo docker ps -a -q) || echo No Docker images
# Delete all images
sudo docker rmi -f $(sudo docker images -q) || echo No Docker containers
sudo docker run -d --name webui-container --hostname webui-container -p 8090:8090 satyamsah/web-interface-image
sudo docker run -d --name mysql-container --hostname mysql-container -e MYSQL_ROOT_PASSWORD=root123 satyamsah/mysql
sudo docker run -d --name rmq-container --hostname rmq-container --name rmq-container rabbitmq:3
sudo docker run -d --name create-emp-container --hostname create-emp-container -p 9090:9090 --link rmq-container --link mysql-container satyamsah/employee-onboard-image
sudo docker run -d --name create-salaryslab-container --hostname create-salaryslab-container --link mysql-container satyamsah/create-salaryslab-image
sudo docker run -d --name api-gateway-container --hostname api-gateway-container -p 9999:9999 satyamsah/gateway-image
sudo docker run -d --name fetch-salary-container --hostname fetch-salary-container -p 3000:3000 --link rmq-container --link mysql-container satyamsah/fetch-salary-image

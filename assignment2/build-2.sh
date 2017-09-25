#!/bin/bash

# Inspired by Jeffry, IUB
echo -------------Build started-------------
echo IN::$PWD;
# Delete all containers
sudo docker rm -f $(sudo docker ps -a -q) || echo No Docker images
# Delete all images
#sudo docker rmi -f $(sudo docker images -q) || echo No Docker containers

sleep 5
sudo docker build -f web-interfaces/Dockerfile -t web-interface-image web-interfaces
sleep 5 
sudo docker run -it --name webui-container --hostname webui-container -p 8090:8090 web-interface-image /bin/bash
sleep 5


#!/bin/bash

ip=curl -i -H "Accept: application/json" -H "Content-Type: application/json" https://ipv4.icanhazip.com/ | tail -n 1

sed -i -e "s/localhost/$ip/g" src/main/resources/static/addemployee.html
sed -i -e "s/localhost/$ip/g" src/main/resources/static/addSalarySlab.html
sed -i -e "s/localhost/$ip/g" src/main/resources/static/addSalarySlab.html
sed -i -e "s/localhost/$ip/g" src/main/resources/static/Welcome.html

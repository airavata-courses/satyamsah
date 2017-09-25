#!/bin/bash

ip=`curl -i -H "Accept: application/json" -H "Content-Type: application/json" https://ipv4.icanhazip.com/ | tail -n 1`

sed -i -e "s/localhost/$ip/g" gateway.js

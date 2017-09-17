sudo apt-get update
sudo echo "deb http://www.rabbitmq.com/debian/ testing main" >> /etc/apt/sources.list
sudo apt-get install -y curl 
sudo curl http://www.rabbitmq.com/rabbitmq-signing-key-public.asc | sudo apt-key add -
sudo apt-get update
sudo apt-get install rabbitmq-server
sudo service rabbitmq-server status
sudo rabbitmq-plugins enable rabbitmq_management

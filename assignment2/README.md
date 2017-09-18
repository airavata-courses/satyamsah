
# Employee-Department-Salary Service


git clone : https://github.com/airavata-courses/satyamsah.git

cd satyamsah
git checkout v2-docker


## Pre- requisite 
1)  [docker](https://docs.docker.com/engine/installation/) should be insalled 


Note(not a part of execution) : command to start a container in interactive mode : `docker run -it image-name /bin/bash`

Note(not a part of execution) to login into a running container: `sudo docker exec -it gatewaycontainer bash`


### Docker swarm 

#### switch to server1: 

install docker :

`chmod 777 installdocker.sh`
`./installdocker.sh`

open firewall ports(server-1):

`chmod 777 firewall.sh`

run `./firewall.sh`

create a swarm manager in primary server:(server-1):
`sudo docker swarm init --advertise-addr <localhost-ip>`

copy the output command(in the following format):

 `docker swarm join --token SWMTKN-1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXfvhk205d2 XXX.XX.XX.XX:2377`

#### switch to server2:

git clone : https://github.com/airavata-courses/satyamsah.git

`cd satyamsah`
`git checkout v2-docker`

##### install docker

`chmod 777 installdocker.sh`
`./installdocker.sh`

##### open firewall ports(server-2):

`chmod 777 firewall.sh`

run `./firewall.sh`

paste the command copied in the above step in server1:
`docker swarm join --token SWMTKN-1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXfvhk205d2 XXX.XX.XX.XX:2377`

#### switch to server1:

Creating a overlay link :
`sudo docker network create -d overlay --attachable overnet`

check for the new network  :
`sudo docker network ls`
`sudo docker inspect overnet`

creating a dummy service to link the two servers though  overlay link :

`sudo docker service create --name myservice --network overnet --replicas 2 nginx`

check that the service is running on both the server:
`sudo docker service ps myservice`


#### switch to server2:dockerized RMQ Installation (in remote server):

`docker run -d --hostname my-rmq --name my-rmq -e RABBITMQ_DEFAULT_USER=test -e RABBITMQ_DEFAULT_PASS=test -p 15672:15672  --net overnet rabbitmq:3-management`

##### Skip this block
(1. type `cd custom-mq`
 2. `sudo docker build -f Dockerfile -t custom-rmq-img .`
 3. type `sudo docker run -d --name rmq-container --hostname rmq-container --name rmq-container rabbitmq:3`)


### switch to server1: Deploy mysql on Docker:

1) `sudo docker pull mysql/mysql-server`

2) `sudo docker run --name mysql-container --hostname mysql-container -e MYSQL_ROOT_PASSWORD=root123 -d --net overnet mysql/mysql-server`

3) `sudo docker exec -it mysql-container mysql -uroot -p` and give the password set for the mysql connection.


#### Database and tables:
Create the 2 databases and 2 tables for employee and salaryslab by excuting the mysql scripts.To do so, install any mysql client preferebly [mysql workbench](https://www.mysql.com/products/workbench) to run mysql scripts below:

execute the commands commands in the script in mysql console:
1) [create-employee.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-employee.sql) :It is creating employee table to store emp id,name, dept,gender . 


2) [create-salaryslab.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-salaryslab.sql) : It is creating a salaryslab table with dept , deignation and salary as columns.The reason is to create a relation between department and designation to map them to fixed salary.It means employees with same designation in the same department will have same salary.

Note (not an execution step): Other way to login is `sudo docker exec -it mysql-container bash` and  `mysql -u root -p`


### run the gateway api server on docker:

1) cd to [gateway-api](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/gateway-api): 

2)  `sudo docker build -f Dockerfile -t gateway-image . `

3)  `sudo docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api-gateway-container`

4) `sudo docker run --name api-gateway-container --hostname api-gateway-container -p 9999:9999 --link my-rmq --net overnet gateway-image`

##### (info step: need not to execute) Steps to know the ip of new api container :

`docker inspect --format='{{range .NetworkSettings.Networks}}{{.IPAddress}}{{end}}' api-gateway-container`

### run the python-flask service on docker:

1) cd to [create-deptmentandsalary-service-python] :

2)  `sudo docker build -f Dockerfile -t python-dept-salary-image . . `

3)  `sudo docker run --name create-salaryslab-container --hostname create-salaryslab-container --link my-rmq  --link mysql-container --net overnet python-dept-salary-image`


###  Run the web-ui server on docker :
1) cd to [web-interfaces]

2) `sudo docker build -f Dockerfile -t spring-boot-web-interface . `

3)  `sudo docker run --name webui-container --hostname webui-container -p 8090:8090 --link api-gateway-container --net overnet spring-boot-web-interface`


### run the application in java-spring service on docker:

1) cd to [employee-onboard-service-javaspring](https://github.com/airavata-courses/satyamsah/tree/assignment2/assignment2/employee-onboard-service-javaspring). As of now, the jar is getting created in local/dev machine,not in docker. :

2)  `sudo docker build -f Dockerfile -t spring-boot-employee-onboard-image . `

3)  `sudo docker run --name create-emp-container --hostname create-emp-container -p 9090:9090 --link my-rmq --link mysql-container spring-boot-employee-onboard-image`


### run the node-js service on docker:

1) cd to [fetch-salary-service-nodejs](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/fetch-salary-service-nodejs): 

2)  `sudo docker build -f Dockerfile -t nodejs-image . `

3)  `sudo docker run --name fetch-salary-container --hostname fetch-salary-container -p 3000:3000 --link my-rmq --link mysql-container nodejs-image`



![alt text](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/workflowdiagram.PNG)
## Description
It is microservice architecture using 3 service. In this project we are assuming that an employee working in a department will have same salary as the other employee working in the same department with same designation.So we can fetch the salary of the employee using the mapping of department and employee :

1)  #### [UI interfaces](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/web-interfaces): The starting point is welcome page running on `http://localhost:8090/`. It is linked to all the UIs running on port 8090.

2)  #### [API gateway](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/gateway-api): All the calls from each of UIs for respective microservice is calling respecting request mapping method in the API gateway service running in port 9999. It is written in node-js.

3) #### [onboarding an employee service](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/employee-onboard-service-javaspring): 
   It is used to register an employee . It will ask for basic info of new employee: Name,Designation, Department,Gender. It is written is "java-spring-boot". It is running at port 9090.
4) #### [department-salary service](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/create-deptmentandsalary-service-python):
   It is use to invoke POST operation to create a table. It will have department, designation and salary. It means employees with same  designation in the same department will have same salary. It is written in "python and flask". It is running at port 5002.
5) #### [getting the salary of an employee service](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/fetch-salary-service-nodejs): 
   While entering the employee Id you will get the salary of that employee.Its starting point is java-spring(running at port 9090) which is calling a service in "node-js" service(running at port 3000) to retrieve the information of salary.
   
6) RMQ : It is used as the communication carrier between api gateway and python service. I also act as communication career between Spring Java service and nodejs service .

### consuming the micoservies using UI. Type the following entries in browser.

1) http://localhost:8090/: Welcome link for all the services. The links in the page will redirect to the following 3 mentioned web-links.

2) http://localhost:8090/addemployee.html : It will ask for basic info of new employee: Name,Designation, Department,Gender. It will save the information in the employee table.The call will redirect to the gateway API port 9999.

3) http://localhost:8090/addSalarySlab.html : It will ask for Department, Designation and Salary assigned. The salary is mapped to dept and designation. It will save the information in the salaryslab table.The call will redirect to the gateway API port 9999.

4) http://localhost:8090/FindSalary.html : It will ask for Employee id to fetch the salary of the employee. Only numeric values are allowed. It will contact both the employee table and  salaryslab table. The employee id is auto-genreted numeric and is hidden from user's input. It starts from 1.The call will redirect to the gateway API port 9999.

#### Proper Use-case scenario for testing end-to-end integration: 

1) one needs to feed-in proper entry in `http://localhost:8090/addemployee.html`

   First Name : Kumar  
   Gender : Male  
   Department : IT  
   Designation: SDE1  

2) And the same kind of entry in the `http://localhost:8090/addSalarySlab.html`:

   Designation: SDE1  
   Department : IT  
   Salary: 20000  

3) Now,when navigate to `http://localhost:8090/FindSalary.html` and enter employee Id, e.g. 1 :

   Enter employee Id:(only numeric): 1  



   It will fetch you the salary.


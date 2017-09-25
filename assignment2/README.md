
# Employee-Department-Salary Service

I am using the `v2_newdockerized` branch of the repo for submitting assignment 2 :


![alt text](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/workflowdiagram.PNG)
## Description
It is microservice architecture using 3 service. In this project we are assuming that an employee working in a department will have same salary as the other employee working in the same department with same designation.So we can fetch the salary of the employee using the mapping of department and employee :

1)  #### [UI interfaces](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/web-interfaces): The starting point is welcome page running on `http://<Remote-IP>:8090/`. It is linked to all the UIs running on port 8090.

2)  #### [API gateway](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/gateway-api): All the calls from each of UIs for respective microservice is calling respecting request mapping method in the API gateway service running in port 9999. It is written in node-js.

3) #### [onboarding an employee service](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/employee-onboard-service-javaspring): 
   It is used to register an employee . It will ask for basic info of new employee: Name,Designation, Department,Gender. It is written is "java-spring-boot". It is running at port 9090.
4) #### [department-salary service](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/create-deptmentandsalary-service-python):
   It is use to invoke POST operation to create a table. It will have department, designation and salary. It means employees with same  designation in the same department will have same salary. It is written in "python and flask". It is running at port 5002.
5) #### [getting the salary of an employee service](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/fetch-salary-service-nodejs): 
   While entering the employee Id you will get the salary of that employee.Its starting point is java-spring(running at port 9090) which is calling a service in "node-js" service(running at port 3000) to retrieve the information of salary.
   
6) RMQ : It is used as the communication carrier between api gateway and python service. I also act as communication career between Spring Java service and nodejs service .

### consuming the micoservies using UI. Type the following entries in browser.

1) http://<Remote-IP>:8090/: Welcome link for all the services. The links in the page will redirect to the following 3 mentioned web-links.

2) http://<Remote-IP>:8090/addemployee.html : It will ask for basic info of new employee: Name,Designation, Department,Gender. It will save the information in the employee table.The call will redirect to the gateway API port 9999.

3) http://<Remote-IP>:8090/addSalarySlab.html : It will ask for Department, Designation and Salary assigned. The salary is mapped to dept and designation. It will save the information in the salaryslab table.The call will redirect to the gateway API port 9999.

4) http://<Remote-IP>:8090/FindSalary.html : It will ask for Employee id to fetch the salary of the employee. Only numeric values are allowed. It will contact both the employee table and  salaryslab table. The employee id is auto-genreted numeric and is hidden from user's input. It starts from 1.The call will redirect to the gateway API port 9999.


We have 3 servers: First on which dockerized miroservices are installed. Second in which RMQ installed.Third is for Jenkins.


Server 1: Microservices server(129.114.17.65 )

Server 2: External RMQ Server(149.165.157.170)

Server 3: Jenkins Server(129.114.104.55)

There is a modificaion in my use-case. I am having 2 RMQ instances. First,Native RMQ is running on a remote server(Server-2)(As per class use-case). I have completed this use-case. But here, I need to hardcode the ipaddress or hostname of remote RMQ inside my microservice code or microservie container /etc/hosts file. 

Secondly I have my RQM continainer running on the same server as micorservices. This will help me not to touch any code in the micoservice. And each of the micoservice can interat with each other. A more elegant way to do this is through docker-swarm which is under development in `v2-docker` repoistory.



#### Pre- requisite (Server1)::

[docker](https://docs.docker.com/engine/installation/) should be insalled (skip if docker is installed)  : 
  
1) `git clone https://github.com/airavata-courses/satyamsah.git`

2) `cd satyamsah`

3) `git checkout v2_newdockerized`

4)  `cd assignment2` 

5) `chmod 777 installdocker.sh`
6) `./installdocker.sh`



### Automated Step to build the whole system

1) jenkins should be installed
2) private key of the known which needed to be fed in jenkins as credentials. If the reviewer wants private key messge me
3)  Put the contents of [jenkinsfile](https://github.com/airavata-courses/satyamsah/edit/v2_newdockerized/assignment2/jenkinsfile) inside pipeline build script.Remember to change the value of `<remote-ip>`to the IP where you want to run the micorservices. Save and build it.
4) The whole system including 6 container will take 5 mins to build. 

#### Proper Use-case scenario for testing end-to-end integration: 

1) one needs to feed-in proper entry in `http://<Remote-IP>:8090/addemployee.html`

   First Name : Kumar  
   Gender : Male  
   Department : IT  
   Designation: SDE1  

2) And the same kind of entry in the `http://<Remote-IP>:8090/addSalarySlab.html`:

   Designation: SDE1  
   Department : IT  
   Salary: 20000  
   

3) Now,when navigate to `http://<Remote-IP>:8090/FindSalary.html` and enter employee Id, e.g. 1 :

   Enter employee Id:(only numeric): 1  



   It will fetch you the salary.




### Manual steps to build the whole system(If you want to do the manual process):
Note(not a part of execution) : command to start a container in interactive mode : `docker run -it image-name /bin/bash`

Note(not a part of execution) to login into a running container: `sudo docker exec -it gatewaycontainer bash`



####  Run the web-ui server on docker(Server1):
1) cd to [web-interfaces]

2) `sudo docker build -f Dockerfile -t spring-boot-web-interface . `

3)  `sudo docker run --name webui-container  --hostname webui-container -p 8090:8090 spring-boot-web-interface`




#### Deploy mysql on Docker(Server1):
##### Database and tables:
Create the 2 databases and 2 tables for employee and salaryslab by excuting the mysql scripts.To do so, install any mysql client preferebly [mysql workbench](https://www.mysql.com/products/workbench) to run mysql scripts below.[create-employee.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-employee.sql) :It is creating employee table to store emp id,name, dept,gender.[create-salaryslab.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-salaryslab.sql) : It is creating a salaryslab table with dept , deignation and salary as columns.The reason is to create a relation between department and designation to map them to fixed salary.It means employees with same designation in the same department will have same salary

1) `sudo docker pull mysql/mysql-server`

2) `sudo docker run --name mysql-container --hostname mysql-container -e MYSQL_ROOT_PASSWORD=root123 -d mysql/mysql-server`

3) `sudo docker exec -it mysql-container mysql -uroot -p` and give the password set for the mysql connection.

execute the commands in the script inside mysql console:

1) [create-employee.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-employee.sql)

2) [create-salaryslab.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-salaryslab.sql)

Note (not an execution step): Other way to login is `sudo docker exec -it mysql-container bash` and  `mysql -u root -p`

Note : exit the mysql console. It will run in the background

#### RMQ Intallation :
There is a modificaion in my use-case. I am having 2 RMQ instances. First,Native RMQ is running on a remote server(Server-2)(As per class use-case). I have completed this use-case. But here , I need to hardcode the ipaddress or hostname of my microservice code or microservie container. 

Secondly I have my RQM continainer running on the same server as micorservices. This will help me not to touch any code in the micoservice. And each of the micoservice can interat with each other. A more elegant way to do this is through docker-swarm which is under development in `v2-docker` repoistory.

##### intall RMQ in remote server 2:

`cd satyamsah/assignment2`  (main github directory)

`chmod 777 rmqinstall.sh`

`./rmqinstall.sh`

##### dockerized RMQ Installation (server 1):

1. type `sudo docker pull rabbitmq`

2. type `sudo docker run -d --name rmq-container --hostname rmq-container --name rmq-container rabbitmq:3`


#### run the application in java-spring service on docker(Server1):

1) cd to [employee-onboard-service-javaspring]. It is using server1 dockerized RMQ server :

2)  `sudo docker build -f Dockerfile -t spring-boot-employee-onboard-image . `

3)  `sudo docker run --name create-emp-container --hostname create-emp-container -p 9090:9090 --link rmq-container --link mysql-container spring-boot-employee-onboard-image`


#### run the python-flask service on docker(server-1):

1) cd to [create-deptmentandsalary-service-python]. It is using remote RMQ- situated in remote server2:

2) edit the salary.py file and change the ipaddress (149.165.157.170) for the rmq server with your remote rmq server. Save it

3)  `sudo docker build -f Dockerfile -t python-dept-salary-image . `

4)  `sudo docker run --name create-salaryslab-container --hostname create-salaryslab-container --link mysql-container python-dept-salary-image`


#### run the gateway api server on docker(Server1):

1) cd to [gateway-api].   It is using server2 RMQ: 

2)  edit the file `gateway.js` and change the ipaddress (amqp://test:test@149.165.157.170) for the rmq server with your remote rmq server. Save it

3) `sudo docker build -f Dockerfile -t gateway-image . `

4)  `sudo docker run --name api-gateway-container --hostname api-gateway-container -p 9999:9999 gateway-image`


#### run the node-js service on docker(Server-1):

1) cd to [fetch-salary-service-nodejs]:

2)  `sudo docker build -f Dockerfile -t nodejs-image . `

3)  `sudo docker run --name fetch-salary-container --hostname fetch-salary-container -p 3000:3000 --link rmq-container --link mysql-container nodejs-image`


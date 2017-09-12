
# Employee-Department-Salary Service

Steps to run the application in docker:

1. sudo docker build -f Dockerfile -t spring-boot-web-interface .

2  sudo docker run -p 7778:7778 spring-boot-web-interface

Make sure the web application is also running on 7778.

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


## Pre- requisite 
1)  install java 8 using this [link](http://www.oracle.com/technetwork/java/javase/downloads/jdk8-downloads-2133151.html) and configure      the classpath
2) install [mysql](https://dev.mysql.com/downloads/mysql/) if not installed
3) install [python3](https://www.python.org/downloads/) if not installed
4) Install pip3 in ubuntu by typing `sudo apt-get install python3-pip` .Link for [pip](https://pip.pypa.io/en/stable/installing/).
5) type `sudo pip3 install flask` on terminal/commandline to install [flask](https://pypi.python.org/pypi/Flask) 
6) type  `sudo apt-get install python3-pymysql` in ubuntu to [install python msql connector](https://pypi.python.org/pypi/PyMySQL/0.7.6)

6) install [NodeJS](https://nodejs.org/en/download/) or in ubuntu type `sudo apt-get install nodejs`
7. confirm that nodjs has been installed by typing `node --version` on terminal/commandline
8. Install [npm](https://www.npmjs.com/get-npm) or in ubunut type `sudo apt-get install npm` 
9. Check whether NPM is succesfully installed has been installed by typing `npm --version` on terminal/commandline

## Database and tables:
Create the 2 databases and 2 tables for employee and salaryslab by excuting the mysql scripts.To do so, install any mysql client preferebly [mysql workbench](https://www.mysql.com/products/workbench) to run mysql scripts below:

1) [create-employee.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-employee.sql) : It is creating employee table to store emp id,name, dept,gender . 
2) [create-salaryslab.sql](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/sqlscript/create-salaryslab.sql) : It is creating a salaryslab table with dept , deignation and salary as columns.The reason is to create a relation between department and designation to map them to fixed salary.It means employees with same designation in the same department will have same salary.


## Booting the 3 micoservices, UI server, Gateway API server:

1) ##### booting the UI server: 
    Run the jar located [web-interfaces](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/web-interfaces/target/demo-0.0.1-SNAPSHOT.jar). It will run this service at port 8090:

2) ##### booting the gateway server (nodejs):
   You can change directory to [gateway-api](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/gateway-api).It will run this service at port 9999.

    a) type `npm install` on terminal/commandline which will download all the dependencies specified in [package.json]
   
    b) type `node gateway.js` to boot the gateway server

3) ##### onboarding an employee service(java spring boot):
   Run the jar located [employee-onboard-service-javaspring](https://github.com/airavata-courses/satyamsah/blob/master/assignment1/employee-onboard-service-javaspring/target/demo-0.0.1-SNAPSHOT.jar). It will run this service at port 9090:
   
   type `java -jar demo-0.0.1-SNAPSHOT.jar` to start the service

3) ##### department-salary service( python-flask): 
   we can enable this service by changing directory to [create-deptmentandsalary-service-python](https://github.com/airavata-courses/satyamsah/tree/master/assignment1/create-deptmentandsalary-service-python) and run salary.py.It will run the  service in port 5002:

   type `python salary.py` to start the service

4) ##### getting the salary of an employee service (nodejs):
   You can change directory to [fetch-salary-service-nodej](https://github.com/satyamsah/microservice/tree/master/fetch-salary-service-nodejs). It will run the  service in port 3000.

    a) type `npm install` on terminal/commandline which will download all the dependencies specified in [package.json]
   
    b) type `node server.js` to boot the server

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


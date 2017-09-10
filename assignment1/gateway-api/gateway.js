var express = require('express');

var app = express();



app.get('/helloworld', function(req,res){
	res.send("hello World");
});

//onboarding an employee service
app.post('/addEmployeeGateway', function(req,res){
	res.redirect(307,'http://localhost:9090/employee/add');
});

//department-salary service
app.post('/addSalaryGateway', function(req,res){
  res.redirect(307,'http://localhost:5002/addSalarySlab');
});
//fetch salary microservice
app.get('/findSalary', function(req,res){
	res.redirect(307,'http://localhost:9090/employee' + req.url);
});

app.get('*', function (req, res) {
  console.log("Bad request");
  res.status(404).send("Wrong resource");
});

app.post('*', function (req, res) {
  console.log("Bad request");
  res.status(404).send("Wrong resource");
});

// Starting the server
app.listen(9999, function () {
  console.log("App started on port 9999");
});
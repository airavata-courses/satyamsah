/**
 * Express app to perform authorization of requests
 */

const express = require('express');
const app = express();

/**
 * Connecting to MySQL
 * Reference: https://www.npmjs.com/package/mysql
 */

var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'salaryuser',
  password : 'ThePassword',
  database : 'salarydb',
  port     : 3306
});
connection.connect();


/**
 * GET endpoint for resource 1
 */
app.get('/helloWorld', function (req, res) {
  res.send("helloWorld");
});

/**
 * GET endpoint for resource 1
 */
app.get('/id/:id/resource1', function (req, res) {
  console.log("Resource 1");
  res.send("Resource 1");
});

/**
 * GET endpoint for resource 2
 */
app.get('/getAllSalarySlab/:dept/:designation', function (req, res) {
  var dept = req.params.dept;
  var designation = req.params.designation;
  console.log("dept -> " + dept);
  console.log("designation -> " + designation);
  var queryString = "SELECT pay FROM `salaryslab` WHERE dept=? AND designation=?;";
  connection.query(queryString, [dept, designation], function (error, result, fields) {
    if (error) {
      //console.log("error->"+error);
      res.send("the employee id is not valid") 
      //throw error;
                 
    }
   // var obj = JSON.parse(result);
   console.log(result[0].pay);
   //console.log(result)
    res.send(result[0].pay);
  });
});

/**
 * Handling all other bad requests
 */
app.get('*', function (req, res) {
  console.log("Bad request");
  res.status(404).send("Wrong resource");
});

// Starting the server
app.listen(3000, function () {
  console.log("App started on port 3000");
});
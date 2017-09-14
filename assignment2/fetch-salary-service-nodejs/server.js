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
  host     : '172.17.0.2',
  user     : 'salaryuser',
  password : 'ThePassword',
  database : 'salarydb',
  port     : 3306
});
connection.connect();


var amqp = require('amqplib/callback_api');

amqp.connect('amqp://172.17.0.6', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var q = 'rpc_queue';

    ch.assertQueue(q, {durable: false});
    ch.prefetch(1);
    console.log(' [x] Awaiting RPC requests');
    ch.consume(q, function reply(msg) {
      var message = msg.content.toString().split(',');

      var dept = message[0];
      var designation =message[1];
      console.log(dept+":"+designation);

      var queryString = "SELECT pay FROM `salaryslab` WHERE dept=? AND designation=?;"
      connection.query(queryString, [dept, designation], function (error, result, fields) {
        if (error) {
          res.send("the employee id is not valid")
        }
       var pay = result[0].pay
       console.log('pay -> ' + pay);
       ch.sendToQueue(msg.properties.replyTo,
        new Buffer(pay.toString()),
        {correlationId: msg.properties.correlationId});
        ch.ack(msg);
      });
    });
  });
});


const PORT = 3030;
const HOST = '0.0.0.0';


// // Starting the server
app.listen(PORT,HOST, function () {
  console.log("App started on port 3000");
});







// /**
//  * GET endpoint for resource 1
//  */
// app.get('/helloWorld', function (req, res) {
//   res.send("helloWorld");
// });

// /**
//  * GET endpoint for resource 1
//  */
// app.get('/id/:id/resource1', function (req, res) {
//   console.log("Resource 1");
//   res.send("Resource 1");
// });


// /**
//  * GET endpoint for resource 2
//  */

// app.get('/getAllSalarySlab/:dept/:designation', function (req, res) {
//   var dept = req.params.dept;
//   var designation = req.params.designation;
//   console.log("dept -> " + dept);
//   console.log("designation -> " + designation);
//   var queryString = "SELECT pay FROM `salaryslab` WHERE dept=? AND designation=?;";
//   connection.query(queryString, [dept, designation], function (error, result, fields) {
//     if (error) {
//       //console.log("error->"+error);
//       res.send("the employee id is not valid") 
//       //throw error;
                 
//     }
//    // var obj = JSON.parse(result);
//    console.log(result[0].pay);
//    //console.log(result)
//     res.send(result[0].pay);
//   });
// });

// /**
//  * Handling all other bad requests
//  */
// app.get('*', function (req, res) {
//   console.log("Bad request");
//   res.status(404).send("Wrong resource");
// });




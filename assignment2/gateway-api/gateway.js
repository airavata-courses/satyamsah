var express = require('express');
var amqp = require('amqplib/callback_api');
var app = express();


var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.get('/helloworld', function(req,res){
	res.send("hello World");
});




//onboarding an employee service
app.post('/addEmployeeGateway', function(req,res){
	res.redirect(307,'http://localhost:9090/employee/add');
});

//department-salary service
app.post('/addSalaryGateway', function(req,res){
    
    const designation = req.body.designation;
    const dept = req.body.dept;
    const pay = req.body.pay;
   
    console.log(designation);
    console.log(dept);
    console.log(pay);
  

    var payload = require('amqplib/callback_api');
    
    amqp.connect('amqp://test:test@149.165.157.170', function(err, conn) {
      conn.createChannel(function(err, ch) {
        ch.assertQueue('', {exclusive: true}, function(err, q) {
          var corr = generateUuid();
  
          //var reqObj = { 'designation': designation, 'dept': dept, 'pay': pay }
         // var payload = JSON.stringify(reqObj)

         var payload=designation+","+dept+","+pay;
    
          console.log(' [x] Requesting the queue for adding an a salaryslab(%s)', payload);
          console.log(corr);
          ch.consume(q.queue, function(msg) {
            if (msg.properties.correlationId == corr) {
              console.log(' [.] Got %s', msg.content.toString());
              setTimeout(function() { conn.close(); }, 500);
              res.send("salary slab added successfully");
            }
          }, {noAck: true});
    
          ch.sendToQueue('create-salary-queue',
          new Buffer(payload.toString()),
          { correlationId: corr, replyTo: q.queue });
        });
      });
    });
    
    function generateUuid() {
      return Math.random().toString() +
             Math.random().toString() +
             Math.random().toString();
    }
});

//fetch salary microservice
app.get('/findSalary', function(req,res){
	res.redirect(307,'http://localhost:9090/employee' + req.url);
});






/*
//onboarding an employee service
app.post('/addEmployeeGateway', function(req,res){
  
  const name = req.body.name;
  const gender = req.body.gender;
  const dept = req.body.dept;
  const designation = req.body.designation;

  console.log(name);
  console.log(gender);
  console.log(dept);
  console.log(designation);
  var payload = require('amqplib/callback_api');
  
  amqp.connect('amqp://localhost', function(err, conn) {
    conn.createChannel(function(err, ch) {
      ch.assertQueue('', {exclusive: true}, function(err, q) {
        var corr = generateUuid();

       var payload=name+","+gender+","+dept+","+designation;
  
        console.log(' [x] Requesting the queue for adding an employee(%s)', payload);
        console.log(corr);
        ch.consume(q.queue, function(msg) {
          if (msg.properties.correlationId == corr) {
            console.log(' [.] Got %s', msg.content.toString());
            setTimeout(function() { conn.close(); process.exit(0) }, 500);
          }
        }, {noAck: true});
  
        ch.sendToQueue('employee-creation-queue',
        new Buffer(payload.toString()),
        { correlationId: corr, replyTo: q.queue });
      });
    });
  });
  
  function generateUuid() {
    return Math.random().toString() +
           Math.random().toString() +
           Math.random().toString();
  }
  
});

*/


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

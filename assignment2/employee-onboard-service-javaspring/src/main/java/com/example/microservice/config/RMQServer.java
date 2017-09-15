package com.example.microservice.config;

import com.example.microservice.accounts.Employee;
import com.example.microservice.accounts.EmployeeRepository;
import com.rabbitmq.client.*;

import java.io.IOException;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;


public class RMQServer {
	@Autowired
	EmployeeRepository employeerepo;
	
	@Autowired 
	Employee employee;
    private  String RPC_QUEUE_NAME = "employee-creation-queue";


    @Autowired
    ConnectionFactory factory;
    


    
public RMQServer(){
	 factory.setHost("localhost");
	 Connection connection = null;
     try {
	         connection      = factory.newConnection();
	         Channel channel = connection.createChannel();
	
	         channel.queueDeclare(RPC_QUEUE_NAME, false, false, false, null);
	
	         channel.basicQos(1);
	
	         System.out.println(" [x] Awaiting RPC requests");
	
	         Consumer consumer = new DefaultConsumer(channel) {
	             @Override
	             public void handleDelivery(String consumerTag, Envelope envelope, AMQP.BasicProperties properties, byte[] body) throws IOException {
	                 AMQP.BasicProperties replyProps = new AMQP.BasicProperties
	                         .Builder()
	                         .correlationId(properties.getCorrelationId())
	                         .build();
	
	                 String response = "";
	
	                 try {
		                        String message = new String(body,"UTF-8");
		                        System.out.println(" [.] fib(" + message + ")");
		                        
		                        String name= message.split(",")[0];
		                        String gender= message.split(",")[1];
		                        String dept= message.split(",")[2];
		                        String designation= message.split(",")[3];
		                        // Employee employee = new Employee();
		                        employee.setName(name);
		                		employee.setGender(gender);
		                		employee.setDept(dept);
		                		employee.setDesignation(designation);
		                		employeerepo.save(employee);
		                		System.out.println("Passed saving into DB....");
		                		response += "saved";
	                     
	                     
	                 }
	                 catch (RuntimeException e){
	                     System.out.println(" [.] " + e.toString());
	                 }
	                 finally {
	                     channel.basicPublish( "", properties.getReplyTo(), replyProps, response.getBytes("UTF-8"));
	
	                     channel.basicAck(envelope.getDeliveryTag(), false);
	                 }
	             }
	         };
	
	         channel.basicConsume(RPC_QUEUE_NAME, false, consumer);
	
	         //...
	     }
	     
	     catch (Exception e) {
			System.out.println("abc");
		}
	
}
       
 }

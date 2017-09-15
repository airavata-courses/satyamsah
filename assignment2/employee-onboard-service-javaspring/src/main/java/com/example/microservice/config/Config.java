package com.example.microservice.config;

import java.io.IOException;
import java.util.concurrent.TimeoutException;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class Config {
	
	@Bean
	public RMQClient client() throws IOException, TimeoutException {
		return new RMQClient();
	}
	
	
	@Bean
	public RMQServer server() {
		return new RMQServer();
	}
}

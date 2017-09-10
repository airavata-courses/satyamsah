package com.example.demo;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;


@Controller
public class ApiGatewayApplicationController {

	@RequestMapping(value="/", method = RequestMethod.GET)
    public String showWelcome(ModelMap model){
        return "Welcome.html";
    }
	
	@RequestMapping(value="/addEmployeeEntry", method = RequestMethod.GET)
    public String addEmployee(ModelMap model){
        return "addemployee.html";
    }
	
	@RequestMapping(value="/addSalary", method = RequestMethod.GET)
    public String addSalaryslab(ModelMap model){
        return "addSalarySlab.html";
    }
	
	@RequestMapping(value="/findSalary", method = RequestMethod.GET)
    public String findSalary(ModelMap model){
        return "FindSalary.html";
    }
}
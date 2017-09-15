package com.example.microservice;

import java.io.IOException;
import java.util.ArrayList;
import java.util.concurrent.TimeoutException;

import javax.servlet.http.HttpServletResponse;
import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.validation.Errors;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.example.microservice.accounts.Employee;
import com.example.microservice.accounts.EmployeeRepository;
import com.example.microservice.config.RMQClient;
import com.example.microservice.config.RMQServer;

@RestController
@RequestMapping("/employee")

public class EmployeeMicroserviceController {

	@Autowired
	EmployeeRepository employeerepo;

	@Autowired
	RMQClient rpcClient;
	
	@Autowired
	RMQServer rpcServer;

	@RequestMapping(value = "/greeting", method = RequestMethod.GET)
	public String getRequest() {
		return "This is Kumar Satyam";

	}

	@RequestMapping(value = "add", method = RequestMethod.POST)
	public String add(@RequestParam String name, @RequestParam String gender, @RequestParam String dept,
			@RequestParam String designation) {

		Employee employee = new Employee();
		employee.setName(name);
		employee.setGender(gender);
		employee.setDept(dept);
		employee.setDesignation(designation);
		employeerepo.save(employee);

		return "saved";

	}

	@RequestMapping(value = "findAll", method = RequestMethod.GET)
	public @ResponseBody Iterable<Employee> getAll() {

		return employeerepo.findAll();

	}

	@RequestMapping(value = "/findSalary", method = RequestMethod.GET)
	public String getOne(@Valid @RequestParam("id") int id) {
		System.out.println("ID -> " + id);
		if (employeerepo.exists(id)) {

			for (Employee emp : employeerepo.findAll()) {
				ArrayList<String> list = new ArrayList<>();
				if (emp.getId() == id) {
					list.add(emp.getDept());
					list.add(emp.getDesignation());
					System.out.println(emp.getDept() + ":" + emp.getDesignation());

					// --------------------RMQ Logic Start-----------------------//
					RMQClient rpc = null;
					String response = null;
					try {
						rpc = new RMQClient();
						String finalmessage = emp.getDept() + "," + emp.getDesignation();
						System.out.println(" [x] Requesting fib(20)");
						response = rpc.call(finalmessage);
						System.out.println(" [.] Got '" + response + "'");
					} catch (IOException | TimeoutException | InterruptedException e) {
						e.printStackTrace();
					} finally {
						if (rpc != null) {
							try {
								rpc.close();
							} catch (IOException _ignore) {
							}
						}
					}
					// --------------------RMQ Logic ENDs-----------------------//

					// String uri = "http://localhost:3000/getAllSalarySlab/" +
					// emp.getDept() + "/" + emp.getDesignation();
					// System.out.println("uri:" + uri);
					// RestTemplate restTemplate = new RestTemplate();
					// String result = restTemplate.getForObject(uri,
					// String.class);
					// System.out.println(result);
					return "Salary of " + emp.getName() + " is $ " + response.toString();
				} else
					continue;
			}
		}

		return "Employee Id not found";

	}

	@ExceptionHandler
	@ResponseStatus(value = HttpStatus.BAD_REQUEST)
	@ResponseBody
	public String handleMethodArgumentNotValidException(MethodArgumentNotValidException error) {
		return "Bad request: " + error.getMessage();
	}

}

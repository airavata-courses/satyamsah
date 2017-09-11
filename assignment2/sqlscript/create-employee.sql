CREATE DATABASE IF NOT EXISTS employeedb;
CREATE USER IF NOT EXISTS 'employeeuser'@'localhost' identified by 'ThePassword';
grant all on employeedb.* to 'employeeuser'@'localhost';
use employeedb;
CREATE TABLE IF NOT EXISTS `employee` (`id` int(11) NOT NULL AUTO_INCREMENT ,`name` varchar(255) NOT NULL,`dept` varchar(255) NOT NULL, `designation` varchar(255) NOT NULL,`gender` varchar(255) NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

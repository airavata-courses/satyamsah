CREATE DATABASE IF NOT EXISTS salarydb;
CREATE USER IF NOT EXISTS 'salaryuser'@'localhost' identified by 'ThePassword';
grant all on salarydb.* to 'salaryuser'@'localhost';
use salarydb;
CREATE TABLE IF NOT EXISTS `salaryslab` (`salaryslabId` int(11) NOT NULL AUTO_INCREMENT ,`designation` varchar(255) NOT NULL,`dept` varchar(255) NOT NULL, `pay` varchar(255) NOT NULL, PRIMARY KEY (`salaryslabId`)) ENGINE=InnoDB DEFAULT CHARSET=utf8 AUTO_INCREMENT=1;

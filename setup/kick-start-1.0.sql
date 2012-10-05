/******************************************************
*   MySQL Database Structure for User Management 
*   for kick-start project 
*/

DELIMITER $$

CREATE DATABASE kickstart$$
USE kickstart$$

CREATE TABLE `sys_users` (
  `userid` int(11) NOT NULL AUTO_INCREMENT,
  `fname` varchar(50) DEFAULT NULL,
  `lname` varchar(50) DEFAULT NULL,
  `email` varchar(75) DEFAULT NULL,
  `login` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `expires` date DEFAULT NULL,
  `superuser` tinyint(1) DEFAULT '0',
  `hidden` tinyint(1) DEFAULT '0',
  `tmp_pass` varchar(32) DEFAULT NULL,
  `tmp_pass_expires` timestamp NULL DEFAULT NULL,
  `last_userid` int(11) DEFAULT NULL,
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `login_UNIQUE` (`login`),
  UNIQUE KEY `userid_UNIQUE` (`userid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1$$

CREATE TABLE `sys_groups` (
  `groupid` int(11) NOT NULL AUTO_INCREMENT,
  `gname` varchar(100) NOT NULL,
  `gdesc` text,
  `last_userid` int(11) DEFAULT NULL,
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`groupid`),
  UNIQUE KEY `gname_UNIQUE` (`gname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1$$

CREATE TABLE `sys_roles` (
  `roleid` int(11) NOT NULL AUTO_INCREMENT,
  `rname` varchar(100) NOT NULL,
  `rdesc` text,
  `last_userid` int(11) DEFAULT NULL,
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`roleid`),
  UNIQUE KEY `rname_UNIQUE` (`rname`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1$$

CREATE TABLE `sys_user_groups` (
  `ugid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `groupid` int(11) NOT NULL,
  `manager` tinyint(1) DEFAULT '0',
  `last_userid` int(11) DEFAULT NULL,
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`ugid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1$$

CREATE TABLE `sys_user_roles` (
  `urid` int(11) NOT NULL AUTO_INCREMENT,
  `userid` int(11) NOT NULL,
  `roleid` int(11) NOT NULL,
  `last_userid` int(11) DEFAULT NULL,
  `last_update` timestamp NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`urid`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1$$
DROP DATABASE IF EXISTS employee_tracker;
CREATE database employee_tracker;

USE employee_tracker;

CREATE TABLE employee(
id INT AUTO_INCREMENT,
first_name  VARCHAR(30) NOT NULL,
last_name VARCHAR(30) NOT NULL,
role_id INT,
manager_id INT NULL,
PRIMARY KEY (id)
);

CREATE TABLE role(
id INT AUTO_INCREMENT,
title  VARCHAR(30) NOT NULL,
salary DECIMAL(10,4)NULL,
department_id INT NULL,
PRIMARY KEY (id)
);

CREATE TABLE department(
id INT AUTO_INCREMENT,
name  VARCHAR(30) NOT NULL,
PRIMARY KEY (id)
);

INSERT INTO department(name)
VALUES('Sales'),('Engineering'),('Finance'),('Legal');


INSERT INTO role(title,salary,department_id)
VALUES('Lead Engineer', 150.000,2),('Software Engineer', 120.000,2),('Sales Lead', 100.000,1),
('Sales Person', 80.000,1), ('Accountant', 125.000,3),
('Legal Team Lead', 250.000,4),('Lawyer', 190.000,4);


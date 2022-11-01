DROP DATABASE IF EXISTS employer_db;
CREATE DATABASE employer_db;

USE employer_db;


CREATE TABLE department (
    id INT NOT NULL,
    name VARCHAR(30),
    PRIMARY KEY (id)
);

CREATE TABLE role (
    id INT NOT NULL,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL NOT NULL
    department_id INT NOT NULL
    PRIMARY KEY (id)
    FOREIGN KEY (department_id) REFERENCES department(id)
);

CREATE TABLE employee (
    id INT NOT NULL,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INT NOT NULL,
    manager_id INT NOT NULL,
    PRIMARY KEY (id)
    FOREIGN KEY (role_id) REFERENCES role(id)
    FOREIGN KEY (manager_id) REFERENCES employee(id)
)
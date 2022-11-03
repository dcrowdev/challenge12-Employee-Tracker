const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }))

const db = mysql.createConnection(
    {
      host: 'localhost',
      user: 'root',
      password: 'Mysql123!',
      database: 'employer_db'

    },
    console.log(`Connected to the employer_db database.`)
)


const init = () => {
    inquirer.prompt({
        type: 'list',
        name: 'vieworadd',
        message: 'What would you like to do?',
        choices: ['View all departments', 'View all roles', 'View all employees', 'Add a department', 'Add a role', 'Add an employee', 'Update an employee role', 'Quit']
        }).then(answer => {
            if (answer.vieworadd === 'Quit') {
                return;
            }
              else if (answer.vieworadd === 'View all departments') {
                db.query('SELECT * FROM departments', function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (answer.vieworadd === 'View all roles') {
                db.query('SELECT * FROM roles', function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (answer.vieworadd === 'View all employees') {
                db.query('SELECT * FROM employees', function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (answer.vieworadd === 'Add a department') {
                addDepartment();
            } else if (answer.vieworadd === 'Add a role') {
                addRole();
            } else if (answer.vieworadd === 'Add an employee') {
                addEmployee();
            } else if (answer.vieworadd === 'Update an employee role') {
                updateEmployee();
            } 
    });
};

const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?'
}).then(answer => {
    db.query(`INSERT INTO departments (name) VALUES ('${answer.department}')`)
}).catch(err => console.error(err));
}

const addRole = () => {
        const departments = [];
        db.query(`SELECT * FROM departments`, (err, results) => {
        if (err) {
            throw (err);
        }
        results.forEach(result => departments.push(result.name));
    }),
     inquirer.prompt([
    {
        type: 'input',
        name: 'rolename',
        message: 'What is the name of the role?'
        },
    {
        type: 'input',
        name: 'rolesalary',
        message: 'What is the salary of the role?'
    },
    {
        type: 'list',
        name: 'roledepartment',
        message: 'Which department does the role belong to?',
        choices: departments
    }
    ]).then(answers => {
        db.query(`SELECT id FROM departments WHERE name = '${answers.roledepartment}'`, (err, results) => {
            if (err) {
                throw err;
            }
            let departmentId = results[0].id;
            console.log(departmentId)
        
        db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)`, [answers.rolename, answers.rolesalary, departmentId], (err, results) => {
            if (err) {
                throw err;
            }
            console.log(`Success!`)
            })
        })
    })
};




const addEmployee = () => {

}

const updateEmployee = () => {

}







init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
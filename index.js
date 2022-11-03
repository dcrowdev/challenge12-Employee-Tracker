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
            process.exit();
        }
        else if (answer.vieworadd === 'View all departments') {
            viewDepartments();
        } else if (answer.vieworadd === 'View all roles') {
            viewRoles();
        } else if (answer.vieworadd === 'View all employees') {
            viewEmployees();
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

const viewDepartments = () => {
    db.query('SELECT * FROM departments ORDER BY name', function (err, results) {
        console.table(results);
        init();
    });
}

const viewRoles = () => {
    db.query(`SELECT roles.id AS 'role_id', roles.title AS 'Role Title', roles.salary AS 'Salary', departments.name AS 'Department Name' FROM roles INNER JOIN departments ON departments.id = roles.department_id`, function (err, results) {
        console.table(results);
        init();
    });
}

const viewEmployees = () => {
    db.query(`SELECT employees.id, employees.first_name AS 'First Name', employees.last_name AS 'Last Name', roles.title AS 'Job Title', departments.name AS 'Department Name', 
                        roles.salary AS 'Salary', CONCAT (M.first_name, " ", M.last_name) AS 'Managers' FROM employees INNER JOIN roles ON employees.role_id = roles.id INNER JOIN departments ON roles.department_id = departments.id LEFT JOIN employees M ON employees.manager_id = M.id ORDER BY employees.last_name`, function (err, results) {
        if (err) {
            throw err;
        }
        console.table(results);
        init();
    });
}

const addDepartment = () => {
    inquirer.prompt({
        type: 'input',
        name: 'department',
        message: 'What is the name of the department?'
    }).then(answer => {
        db.promise().query(`INSERT INTO departments (name) VALUES ('${answer.department}')`).then(([response]) => {
            if (response.affectedRows > 0) {
                viewDepartments();
            } else {
                console.info('Failed to create department')
                init();
            }
        })
    })
}

const addRole = async () => {
    const [departments] = await db.promise().query('SELECT * FROM departments');
    const departmentArr = departments.map(department => (
        {
            name: department.name,
            value: department.id
        }
    ))
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
            choices: departmentArr
        }
    ]).then(answers => {
        let roleObj = { title: answers.rolename, salary: answers.rolesalary, department_id: answers.roledepartment }
        db.promise().query('INSERT INTO roles SET ?', roleObj).then(([response]) => {
            if (response.affectedRows > 0) {
                viewRoles();
            } else {
                console.info('Failed to create new role')
                init();
            }
        })
    })
};




// const addEmployee = () => {
//     inquirer.prompt([
//         {
//             type: 'input',
//             name: 'firstname',
//             message: 'What is the employees first name?'
//         },
//         {
//             type: 'input',
//             name: 'lastname',
//             message: 'What is the employees last name?'
//         },
//         {
//             type: 'list',
//             name: 'employeerole',
//             message: 'What is the employees role?',
//             choices: 
//         },
//         {
//             type: 'list',
//             name: 'employeemanager',
//             message: 'Who is the employees manager?',
//             choices: ['None', ]
//         }
// ])
// }

const updateEmployee = async () => {
    const [employees] = await db.promise().query('SELECT * FROM employees');
    const employeeArr = employees.map(employee => ({
        name: employee.first_name + ' ' + employee.last_name,
        value: employee.id
    }))
    const [roles] = await db.promise().query('SELECT * FROM roles');
    const rolesArr = roles.map(role => ({
        name: role.title,
        value: role.id
    }))
    inquirer.prompt([
        {
            type: 'list',
            name: 'whoupdate',
            message: 'Which employees role would you like to update?',
            choices: employeeArr
        },
        {
            type: 'list',
            name: 'assignrole',
            message: 'Which role do you want to assign the selected employee?',
            choices: rolesArr
        }

    ]).then(answers => {
        let employeeObj = { role_id: answers.assignrole };
        let id = answers.whoupdate;
        db.promise().query('UPDATE employees SET ? WHERE employees.id = ?', [employeeObj, id]).then(([response]) => {
            if (response.affectedRows > 0) {
                viewEmployees();
            } else {
                console.info('Failed to update employee')
                init();
            }
        })
    })
}

init();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
});
const { urlencoded } = require('express');
const express = require('express');
const inquirer = require('inquirer');
const mysql = require('mysql2');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(urlencoded({ extended: true }))

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
            if (answer.vieworadd === 'View all departments') {
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
            }


    })
}









init();

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
});
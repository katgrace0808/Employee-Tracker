const Employee = require('./lib/Employee');
const Role = require('./lib/Role');
const Department = require('./lib/Department');
const inquirer = require('inquirer');
const mysql = require('mysql');

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Riley2016!',
    database: 'employee_trackerDB'
});

connection.connect(function (err) {
    if (err) throw err;
    runSearch();
})

function runSearch() {
    inquirer
        .prompt({
            name: "action",
            type: "rawlist",
            message: "What would you like to do?",
            choices: [
                "View employee list",
                "View department list",
                "View roles",
                "Add employee",
                "Add department",
                "Add role",
                "Update employee role",
                "Quit"
            ]
        })
        .then(function (answer) {
            console.log(answer);
            switch (answer.action) {
                case 'View employee list':
                    employeeList();
                    break;
                case 'View department list':
                    departmentList();
                    break;
                case 'View roles':
                    roleList();
                    break;
                case 'Quit':
                    connection.end();
            }
        });
}

function employeeList() {
    connection.query('SELECT * FROM employee', function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function departmentList() {
    connection.query('SELECT * FROM department', function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function roleList() {
    connection.query('SELECT * FROM role', function (err, res) {
        if (err) throw err;
        console.table(res);
        runSearch();
    })
}

function employeeAdd() {
    inquirer
        .prompt({
            name: 'employee_id_add',
            type: 'input',
            message: 'What is the ID for the employee?'
        },
        {
            name: 'employee_first_name_add',
            type: 'input',
            message: 'What is their first name?'
        },
        {
            name: 'employee_last_name_add',
            type: 'input',
            message: 'What is their last name?'
        },
        {
            name: 'employee_role_add',
            type: 'input',
            message: 'What is their role?'
        },
        {
            name: 'employee_manager_add',
            type: 'input',
            message: 'Who is their manager?'
        })
        .then(function(answer) {
            let query = "SELECT * FORM employee";
            connection.query(query, data, function(err, res) {
                console.log(res);
            })
        })
}
const Employee = require('./lib/Employee');
const Role = require('./lib/Role');
const Department = require('./lib/Department');
const inquirer = require('inquirer');
const mysql = require('mysql');


let employeeArr = [];
let roleArr = [];
let departmentArr = [];

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'Riley2016!',
    database: 'employee_trackerDB'
});

let connectionTwo = mysql.createConnection({
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
                case 'Add employee':
                    employeeAdd();
                    break;
                case 'Add department':
                    departmentAdd();
                    break;
                case 'Add role':
                    roleAdd();
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
    connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let employeeList = res[i].first_name + ' ' + res[i].last_name;
            employeeArr.push(employeeList);
        }
    })
    connectionTwo.query("SELECT title FROM role", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let roleList = res[i].title;
            roleArr.push(roleList);
        }
    })
    inquirer
        .prompt([{
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
            type: 'list',
            message: 'What is their role?',
            choices: roleArr
        },
        {
            name: 'employee_manager_add',
            type: 'list',
            message: 'Who is their manager?',
            choices: employeeArr
        }
        ])
        .then(function (answer) {
            let queryRole = "SELECT role_id FROM role WHERE ?";
            connection.query(queryRole, { title: answer.employee_role_add }, function (err, res) {
                for (let i = 0; i < res.length; i++) {
                    console.log(res[i].role_id);
                    return res[i].role_id;
                }
                connection.end();
            })
            let manager = answer.employee_manager_add.split(' ').slice(1);
            let queryManager = "SELECT manager_id FROM employee WHERE ?"
            connectionTwo.query(queryManager, { last_name: manager }, function (err, res) {
                for (let i = 0; i < res.length; i++) {

                    console.log(res[i].manager_id);
                    return res[i].manager_id;
                }
                connection.end();
            })
            let id = answer.employee_id_add;
            let firstName = answer.employee_first_name_add;
            let lastName = answer.employee_last_name_add;
            // let roleId = res[i].role_id;
            // let managerId = res[i].manager_id;
            let query = "INSERT INTO department VALUES (?,?,?,?,?)";
            connection.query(query, [id, firstName, lastName, res[i].role_id, res[i].manager_id], function (err, res) {
                if (err) throw err;
                runSearch();
            });
        })
}

function departmentAdd() {
    inquirer
        .prompt([{
            name: 'department_id',
            type: 'input',
            message: 'What is the department ID?'
        },
        {
            name: 'name',
            type: 'input',
            message: 'What is the department name?'
        }])
        .then(function (answer) {
            let id = answer.department_id;
            let name = answer.name;
            let query = "INSERT INTO department VALUES (?,?)";
            connection.query(query, [id, name], function (err, res) {
                if (err) throw err;
                runSearch();
            })
        })
}

function roleAdd() {
    connectionTwo.query("SELECT name FROM department", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let departmentList = res[i].name;
            departmentArr.push(departmentList);
        }
    })
    inquirer
        .prompt([{
            name: 'role_id_add',
            type: 'input',
            message: 'What is the ID for the role?'
        },
        {
            name: 'role_title_add',
            type: 'input',
            message: 'What is title of the role?'
        },
        {
            name: 'role_salary_add',
            type: 'input',
            message: 'What is the role salary?'
        },
        {
            name: 'role_department_add',
            type: 'list',
            message: 'What department should this role be applied?',
            choices: departmentArr
        }
        ])
        .then(function (answer) {
            connection.query("SELECT first_name, last_name FROM employee", function (err, res) {
                if (err) throw err;
                console.log(answer);
                runSearch();
            })
        })
}
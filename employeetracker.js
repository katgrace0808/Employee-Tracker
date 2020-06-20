const inquirer = require('inquirer');
const mysql = require('mysql');
require('dotenv').config();

let employeeArr = [];
let roleArr = [];
let departmentArr = [];
let employeeArrTwo = [];
let roleArrTwo = [];

let connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
    database: 'employee_trackerDB'
});

let connectionTwo = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: process.env.DB_PASSWORD,
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
                "Delete department",
                "Delete role",
                "Delete employee",
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
                case 'Update employee role':
                    updateEmployeeRole();
                    break;
                case 'Delete department':
                    deleteDepartment();
                    break;
                case 'Delete role':
                    deleteRole();
                    break;
                case 'Delete employee':
                    deleteEmployee();
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
    connection.query("SELECT employee_id, first_name, last_name FROM employee", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let employeeList = res[i].employee_id + ' ' + res[i].first_name + ' ' + res[i].last_name;
            employeeArr.push(employeeList);
        }
    })
    connectionTwo.query("SELECT role_id, title FROM role", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let roleList = res[i].role_id + ' ' + res[i].title;
            roleArr.push(roleList);
        }
    })
    inquirer
        .prompt([{
            name: 'employee_id_add',
            type: 'input',
            message: 'What is the ID for the employee?',
            validate: employeeIdLength
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
            let id = answer.employee_id_add;
            let firstName = answer.employee_first_name_add;
            let lastName = answer.employee_last_name_add;
            let roleId = answer.employee_role_add.split(' ').slice(0, 1);
            let managerId = answer.employee_manager_add.split(' ').slice(0, 1);
            // console.log(roleId);
            // console.log(managerId);
            let query = "INSERT INTO employee VALUES (?,?,?,?,?)";
            connection.query(query, [id, firstName, lastName, roleId, managerId], function (err, res) {
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
            message: 'What is the department ID?',
            validate: departmentIdLength
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
    connection.query("SELECT department_id, name FROM department", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let departmentList = res[i].department_id + ' ' + res[i].name;
            departmentArr.push(departmentList);
        }
    })
    inquirer
        .prompt([{
            name: 'role_id_add',
            type: 'input',
            message: 'What is the ID for the role?',
            validate: roleIdLength
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
            let roleId = answer.role_id_add;
            let title = answer.role_title_add;
            let salary = answer.role_salary_add;
            let departmentId = answer.role_department_add.split(' ').slice(0, 1);
            let query = "INSERT INTO role VALUES (?,?,?,?)"
            connection.query(query, [roleId, title, salary, departmentId], function (err, res) {
                if (err) throw err;
                console.log(answer);
                runSearch();
            })
        })
}

function updateEmployeeRole() {
    connection.query("SELECT employee_id, first_name, last_name FROM employee", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let employeeList = res[i].employee_id + ' ' + res[i].first_name + ' ' + res[i].last_name;
            employeeArr.push(employeeList);
        }
    })
    connectionTwo.query("SELECT role_id, title FROM role", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let roleList = res[i].role_id + ' ' + res[i].title;
            roleArr.push(roleList);
        }
    })
    inquirer
        .prompt([{
            name: 'change_date',
            type: 'list',
            message: 'Is this a recent change?',
            choices: ['Yes', 'No']
        },
        {
            name: 'employee_role_update',
            type: 'list',
            message: 'Whose role do you wish to update?',
            choices: employeeArr
        },
        {
            name: 'employee_role_change',
            type: 'list',
            message: 'What is their new role?',
            choices: roleArr
        }
        ])
        .then(function (answer) {
            let employeeToChange = answer.employee_role_update.split(' ').slice(0, 1);
            console.log(employeeToChange)
            let newRole = answer.employee_role_change.split(' ').slice(0, 1);
            let query = "UPDATE employee SET ? WHERE ?";
            connection.query(query, [{role_id: newRole}, {employee_id: employeeToChange}], function (err, res) {
                if (err) throw err;
                runSearch();
            })
        })
}

function deleteDepartment() {
    connection.query("SELECT department_id, name FROM department", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let departmentList = res[i].department_id + ' ' + res[i].name;
            departmentArr.push(departmentList);
        }
    })
    inquirer
        .prompt([{
            name: 'date_record',
            type: 'input',
            message: 'What is the effective date of the deletion?',
            default: "MM/DD/YYYY"
        },
        {
            name: 'department_delete',
            type: 'list',
            message: 'What department do you want to delete?',
            choices: departmentArr
        }
        ])
        .then(function (answer) {
            let departmentId = answer.department_delete.split(' ').slice(0, 1);
            let query = "DELETE FROM department WHERE ?"
            connection.query(query, {department_id: departmentId}, function (err, res) {
                if (err) throw err;
                console.log(answer);
                runSearch();
            })
        })
}

function deleteRole() {
    connection.query("SELECT role_id, title FROM role", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let roleList = res[i].role_id + ' ' + res[i].title;
            roleArr.push(roleList);
        }
    })
    inquirer
        .prompt([{
            name: 'date_record',
            type: 'input',
            message: 'What is the effective date of the deletion?',
            default: "MM/DD/YYYY"
        },
        {
            name: 'role_delete',
            type: 'list',
            message: 'What role do you want to delete?',
            choices: roleArr
        }
        ])
        .then(function (answer) {
            let roleId = answer.role_delete.split(' ').slice(0, 1);
            let query = "DELETE FROM role WHERE ?"
            connection.query(query, {role_id: roleId}, function (err, res) {
                if (err) throw err;
                console.log(answer);
                runSearch();
            })
        })
}

function deleteEmployee() {
    connection.query("SELECT employee_id, first_name, last_name FROM employee", function (err, res) {
        for (let i = 0; i < res.length; i++) {
            let employeeList = res[i].employee_id + ' ' + res[i].first_name + ' ' + res[i].last_name;
            employeeArr.push(employeeList);
        }
    })
    inquirer
        .prompt([{
            name: 'date_record',
            type: 'input',
            message: 'What is the effective date of the deletion?',
            default: "MM/DD/YYYY"
        },
        {
            name: 'employee_delete',
            type: 'list',
            message: 'What employee do you want to delete?',
            choices: employeeArr
        }
        ])
        .then(function (answer) {
            let employeeId = answer.employee_delete.split(' ').slice(0, 1);
            let query = "DELETE FROM employee WHERE ?"
            connection.query(query, {employee_id: employeeId}, function (err, res) {
                if (err) throw err;
                console.log(answer);
                runSearch();
            })
        })
}



// Validations

function employeeIdLength(employee_id_add, minlength, maxlength)
{  	
   let userInput = employee_id_add;
   if(userInput.length >= 6 && userInput.length <= 6)
      {  	
        return true;  	
      }
   else
      {  	
	console.log(" Please input 6 numbers");  		
        return false;  	
      }  
}

function departmentIdLength(department_id, minlength, maxlength)
{  	
   let userInput = department_id;
   if(userInput.length >= 4 && userInput.length <= 4)
      {  	
        return true;  	
      }
   else
      {  	
	console.log(" Please input 4 numbers");  		
        return false;  	
      }  
}

function roleIdLength(role_id, minlength, maxlength)
{  	
   let userInput = role_id;
   if(userInput.length >= 2 && userInput.length <= 2)
      {  	
        return true;  	
      }
   else
      {  	
	console.log(" Please input 2 numbers");  		
        return false;  	
      }  
}
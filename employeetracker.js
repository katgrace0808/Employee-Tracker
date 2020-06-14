const inquirer = require('inquirer');
const mysql = require('mysql');

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
                "Update employee role"
            ]
        })
        .then(function(answer) {
            console.log(answer);
        })
}
runSearch();
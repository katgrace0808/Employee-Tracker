USE employee_trackerDB;

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (354624, 'Emily', 'Grant', 20, 689547), (689547, 'Sarah', 'Miller', 22, NULL), (187365, 'Mark', 'Smith', 20, 689547), (947158, 'Lance', 'Johnson', 21, 348159);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (348159, 'Rhonda', 'McCallister', 22, NULL), (487321, 'Ryan', 'Howard', 27, 689547), (510278, 'Lucy', 'Hsu', 26, NULL), (201056, 'George', 'Jetson', 23, 406501);

INSERT INTO employee (employee_id, first_name, last_name, role_id, manager_id)
VALUES (406501, 'Yolanda', 'Jones', 24, NULL), (984510, 'Jimmy', 'Wentz', 25, 348159), (251003, 'Kerry', 'Masters', 23, 406501), (470894, 'Felicia', 'Foster', 21, 348159);


INSERT INTO role (role_id, title, salary, department_id)
VALUES (20, 'Software Engineer', 110000, 5698), (21, 'Accountant', 88000, 6457), (22, 'Manager', 150000, 4897), (23, 'HR Representative', 65000, 1684);

INSERT INTO role (role_id, title, salary, department_id)
VALUES (24, 'CEO', 180000, 4897), (25, 'Accounts Payable Rep', 45000, 6457), (26, 'Marketing Analyst', 90000, 3154), (27, 'Intern', 25000, 5698);


INSERT INTO department (department_id, name)
VALUES (5698, 'IT Services'), (6457, 'Accounting'), (4897, 'Administration'), (3154, 'Marketing'), (1684, 'Human Resources'), (6974, 'Training');










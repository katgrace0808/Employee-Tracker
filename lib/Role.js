class Role {
    constructor(role_id, title, salary, department_id) {
        this.role_id = role_id;
        this.title = title;
        this.salary = salary;
        this.department_id = department_id;
    }

    getId() {
        return this.role_id;
    }

    getTitle() {
        return this.title;
    }

    getSalary() {
        return this.salary;
    }

    getDepartmentId() {
        return this.department_id;
    }

    // getRole() {
    //     return "Employee";
    // }
}
module.exports = Role;
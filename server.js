const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

const db = mysql.createConnection(
  {
    host: "localhost",
    user: "root",
    password: "password",
    database: "employee_db",
  },
  console.log(`Connected to the employee database.`)
);

function mainMenu() {
  inquirer
    .prompt([
      {
        type: "list",
        name: "viewOptions",
        message: "What would you like to do?",
        choices: [
          "View All Departments",
          "View All Roles",
          "View All Employees",
          "Add Department",
          "Add Role",
          "Add Employee",
          "Update Employee Role",
          "I'm Done",
        ],
      },
    ])
    .then((answers) => {
      switch (answers.viewOptions) {
        case "View All Departments":
          return viewAllDepts();
        case "View All Roles":
          return viewAllRoles();
        case "View All Employees":
          return viewAllEmployees();
        case "Add Department":
          return addDepartment();
        case "Add Role":
          return addRole();
        case "Add Employee":
          return addEmployee();
        case "Update Employee Role":
          return updateEmpRole();
        default:
          process.exit();
      }
    });
}

function viewAllDepts() {
  const sql = `SELECT id AS id, department_name AS department FROM department ORDER BY department.department_name`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
}

function viewAllRoles() {
  const sql = `SELECT er.id, er.title, er.salary, d.department_name AS department FROM employee_role er JOIN department d ON er.department_id = d.id`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
}

function viewAllEmployees() {
  const sql = `SELECT e.id, e.first_name, e.last_name, er.title AS role, er.salary, d.department_name AS department, m.first_name AS manager FROM employee e LEFT JOIN employee_role er ON e.role_id = er.id LEFT JOIN department d ON er.department_id = d.id LEFT JOIN employee m ON m.id = e.manager_id ORDER BY e.first_name`;

  db.query(sql, (err, rows) => {
    if (err) {
      console.log(err);
      return;
    }
    console.table(rows);
    mainMenu();
  });
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDept",
        message: "What is the name of the department?",
      },
    ])
    .then((answers) => {
      const sql = `INSERT INTO department(department_name) VALUES(?)`;
      const params = answers.addDept;

      db.query(sql, params, (err, result) => {
        if (err) {
          console.log(err);
          return;
        }
        console.info(`added ${answers.addDept} to the database`);
        mainMenu();
      });
    });
}

function addRole() {
  const getDepartments = [];
  db.query(`SELECT department_name, id FROM department`, (err, result) => {
    for (let i = 0; i < result.length; i++) {
      getDepartments.push({
        name: result[i].department_name,
        value: result[i].id,
      });
    }
    inquirer
      .prompt([
        {
          type: "input",
          name: "roleName",
          message: "What is the name of the role?",
        },
        {
          type: "input",
          name: "roleSalary",
          message: "What is the salary of the role?",
        },
        {
          type: "list",
          name: "roleDepartment",
          message: "Which department is the role?",
          choices: getDepartments,
        },
      ])
      .then((answers) => {
        const sql = `INSERT INTO employee_role (title, salary, department_id) VALUES(?, ?, ?) `;
        const params = [
          answers.roleName,
          answers.roleSalary,
          answers.roleDepartment,
        ];

        db.query(sql, params, (err, result) => {
          if (err) {
            console.log(err);
            return;
          }
          console.info(`added ${answers.roleName} to the database`);
          mainMenu();
        });
      });
  });
}

function addEmployee() {
  const getTitle = [];
  db.query(`SELECT er.id, er.title FROM employee_role er`, (err, result) => {
    for (let i = 0; i < result.length; i++) {
      getTitle.push({ name: result[i].title, value: result[i].id });
    }
    const getManager = ["none"];
    db.query(`SELECT * FROM employee`, (err, result) => {
      if (err) throw err;
      for (let j = 0; j < result.length; j++) {
        getManager.push({
          name: result[j].first_name + " " + result[j].last_name,
          value: result[j].id,
        });
      }

      inquirer
        .prompt([
          {
            type: "input",
            name: "firstName",
            message: "What is employee's first name?",
          },
          {
            type: "input",
            name: "lastName",
            message: "What is employee's last name?",
          },
          {
            type: "list",
            name: "empRole",
            message: "What is the employee's role?",
            choices: getTitle,
          },
          {
            type: "list",
            name: "empManager",
            message: "What is the employee's manager?",
            choices: getManager,
            default: "none",
          },
        ])
        .then((answers) => {
          const sql = `INSERT INTO employee (first_name, last_name , role_id, manager_id) VALUES(?, ?, ?, ?)`;
          if (answers.empManager === "none") {
            answers.empManager = null;
          }
          const params = [
            answers.firstName,
            answers.lastName,
            answers.empRole,
            answers.empManager,
          ];
          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            console.info(`added ${answers.firstName} to the database`);
            mainMenu();
          });
        });
    });
  });
}

function updateEmpRole() {
  const employeeNames = [];
  db.query(`SELECT * FROM employee`, (err, result) => {
    if (err) throw err;
    for (let i = 0; i < result.length; i++) {
      employeeNames.push({
        name: result[i].first_name + " " + result[i].last_name,
        value: result[i].id,
      });
    }
    const allRoles = [];
    db.query(`SELECT id, title FROM employee_role`, (err, result) => {
      for (let j = 0; j < result.length; j++) {
        allRoles.push({ name: result[j].title, value: result[j].id });
      }
      inquirer
        .prompt([
          {
            type: "list",
            name: "pickEmployee",
            message: "Which employee's role would you like to update?",
            choices: employeeNames,
          },
          {
            type: "list",
            name: "newRole",
            message:
              "What role do you want to reassign for the selected employee?",
            choices: allRoles,
          },
        ])
        .then((answers) => {
          const sql = `UPDATE employee SET employee.role_id = ? WHERE employee.id = ?`;
          const params = [answers.newRole, answers.pickEmployee];

          db.query(sql, params, (err, result) => {
            if (err) {
              console.log(err);
              return;
            }
            console.info(`updated employee in the database`);
            mainMenu();
          });
        });
    });
  });
}

function init() {
  mainMenu();
}

init();

// Import MySQL
const mysql = require('mysql2');
// Import inquirer
const inquirer = require('inquirer');

// Connection to the MySQL db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'seattle1234',
    database: 'employees_db'
},
    console.log(`Connected to the employees_db database.`)
);

const startApp = async () => {
    // Prompt user to select an option from the menu
    const { choice } = await inquirer.prompt([
        {
            name: 'choice',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role',
                'Exit',
            ],
        },
    ]);

switch (choice) {
    case 'View all departments':
        // Call the function to view all departments
        viewAllDepartments();
        break;
    case 'View all roles':
        // Call the function to view all roles
        viewAllRoles();
        break;
    case 'View all employees':
        // Call the function to view all employees
        viewAllEmployees();
        break;
    case 'Add a department':
        // Call the function to add a department
        addDepartment();
        break;
    case 'Add a role':
        // Call the function to add a role
        addRole();
        break;
    case 'Add an employee':
        // Call the function to add an employee
        break;
    case 'Update an employee role':
        // Call the function to update an employee role
        break;
    case 'Exit':
        // Exit the app
        console.log('Exiting application.');
        process.exit(0);
    }
};

// Create function for viewAllDepartments
const viewAllDepartments = () => {
    // Selects the id and name columns from department table
    const sql = 'SELECT id, name FROM department';
    // Executes the SQL query with err/res params
    db.query(sql, (err, res) => {
        if (err) {
            console.error('Error retrieving departments:', err);
        } else {
            // Log results in table format
            console.table(res);
        }

        // Prompt user to select another option or exit
        startApp();
    });
};

const viewAllRoles = () => {
    // Selects id, title, and salary from role table, and department name from department then join results in a table
    const sql = `
      SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary
      FROM role
      JOIN department ON role.department_id = department.id
    `;
    // Executes the SQL query with err/res params
    db.query(sql, (err, res) => {
      if (err) {
        console.error('Error retrieving roles:', err);
      } else {
        // Log the results in a table
        console.table(res);
      }
  
      // Prompt the user to select another option or exit
      startApp();
    });
  };  
  
  const viewAllEmployees = () => {
    // Select each from appropriate tables and use join to combine into a table
    const sql = `
      SELECT 
        employee.id AS 'Employee ID',
        employee.first_name AS 'First Name',
        employee.last_name AS 'Last Name',
        role.title AS 'Job Title',
        department.name AS 'Department',
        role.salary AS 'Salary',
        CONCAT(manager.first_name, ' ', manager.last_name) AS 'Manager'
      FROM 
        employee
      LEFT JOIN 
        role ON employee.role_id = role.id
      LEFT JOIN 
        department ON role.department_id = department.id
      LEFT JOIN 
        employee AS manager ON employee.manager_id = manager.id
    `;
    // Executes the SQL query with err and res params
    db.query(sql, (err, res) => {
      if (err) {
        console.error('Error retrieving employees:', err);
      } else {
        // Log results in a table
        console.table(res);
      }
  
      // Prompt the user to select another option or exit
      startApp();
    });
  };
// Create async function addDepartment
  const addDepartment = async () => {
    // Prompts user to enter name of department
    try {
      const { departmentName } = await inquirer.prompt([
        {
          name: 'departmentName',
          type: 'input',
          message: 'Enter the name of the department:',
          // Be sure user enters valid department name
          validate: (input) => {
            if (input.trim() === '') {
              return 'Please enter a valid department name.';
            }
            return true;
          },
        },
      ]);
      // (?) placeholder for a value provided by user
      const sql = 'INSERT INTO department (name) VALUES (?)';
      // Executes SQL query and takes in the department Name input
      db.query(sql, [departmentName], (err, res) => {
        if (err) {
          console.error('Error adding department:', err);
        } else {
          console.log('Department added successfully!');
        }
  
        // Prompt the user to select another option or exit
        startApp();
      });
    } catch (err) {
      console.error('Error occurred:', err);
      process.exit(1);
    }
  };
  
  // Create async function for addRole
  const addRole = async () => {
    try {
      // Get list of departments
      const departments = await getDepartments();
  
      // Prompt user for role details
      const { roleName, roleSalary, departmentId } = await inquirer.prompt([
        {
          name: 'roleName',
          type: 'input',
          message: 'Enter the name of the role:',
          validate: (input) => {
            if (input.trim() === '') {
              return 'Please enter a valid role name.';
            }
            return true;
          },
        },
        {
          name: 'roleSalary',
          type: 'input',
          message: 'Enter the salary for the role:',
          validate: (input) => {
            if (!input.match(/^\d+(\.\d{1,2})?$/)) {
              return 'Please enter a valid salary (ex, 100000).';
            }
            return true;
          },
        },
        {
          name: 'departmentId',
          type: 'list',
          message: 'Which department does this role belong to?',
          choices: departments.map((department) => ({
            name: department.name,
            value: department.id,
          })),
        },
      ]);
  
      // Insert the role into the database
      const sql = 'INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?)';
      // Executes SQL query with the inputs from user
      db.query(sql, [roleName, roleSalary, departmentId], (err, res) => {
        if (err) {
          console.error('Error adding role:', err);
        } else {
          console.log('Role added successfully!');
        }
  
        // Prompt the user to select another option or exit
        startApp();
      });
    } catch (err) {
      console.error('Error occurred:', err);
      process.exit(1);
    }
  };
  
  // Created getDepartments function
  const getDepartments = () => {
    // created a promise constructor with resolve and reject
    return new Promise((resolve, reject) => {
        // Retrieves id and name from department table
      const sql = 'SELECT id, name FROM department';
    
      db.query(sql, (err, res) => {
        if (err) {
          reject(err);
        } else {
          resolve(res);
        }
      });
    });
  };

// Establish the db and start the application
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
  
    console.log('Connected to the database!');
  
    // Call the startApp function to begin the application
    startApp();
  });
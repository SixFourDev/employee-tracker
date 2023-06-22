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
        break;
    case 'Add a role':
        // Call the function to add a role
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

const viewAllDepartments = () => {
    const sql = 'SELECT id, name FROM department';

    db.query(sql, (err, res) => {
        if (err) {
            console.error('Error retrieving departments:', err);
        } else {
            console.table(res);
        }

        // Prompt user to select another option or exit
        startApp();
    });
};

const viewAllRoles = () => {
    const sql = `
      SELECT role.id AS id, role.title AS title, department.name AS department, role.salary AS salary
      FROM role
      JOIN department ON role.department_id = department.id
    `;
  
    db.query(sql, (err, res) => {
      if (err) {
        console.error('Error retrieving roles:', err);
      } else {
        console.table(res);
      }
  
      // Prompt the user to select another option or exit
      startApp();
    });
  };  
  
  const viewAllEmployees = () => {
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
  
    db.query(sql, (err, res) => {
      if (err) {
        console.error('Error retrieving employees:', err);
      } else {
        console.table(res);
      }
  
      // Prompt the user to select another option or exit
      startApp();
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
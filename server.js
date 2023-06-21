// Import MySQL
const mysql = require('mysql2');
// Import inquirer
const inquirer = require('inquirer');

// Connection to the MySQL db
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees_db'
},
    console.log(`Connected to the employees_db database.`)
);
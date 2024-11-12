// dbConfig.js
const mysql = require('mysql2');

const pool = mysql.createPool({
  host: 'DMI-0241',     // Replace with your database host
  user: 'root',  // Your database username
  password: 'guidedsearch', // Your database password
  database: '', // Your database name
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool.promise(); // Enable promise-based methods

const mysql = require('mysql2/promise');

const pool = mysql.createPool({
  host: '31.220.110.101',
  user: 'u350327849_mobile',
  password: '!Bacoom123!',
  database: 'u350327849_project_mobile',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = pool;
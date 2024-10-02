const mysql = require('mysql2/promise');

// MySQL Connection Pool Setup
const pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: 'Daniela04.',
  database: 'ATV',
});

module.exports = pool;

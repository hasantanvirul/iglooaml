const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt'); // For password hashing

// Assuming you have a table named 'employee' in your database with columns 'employeeID' and 'password'

// Login function
const login = (req, res) => {
  const { employeeid, password } = req.body;
  const mysql = require('mysql');
  const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'iglooaml'
  });
  
  const query = 'SELECT * FROM employee WHERE employeeid = ?';
  connection.query(query, [employeeid], (err, results) => {
    if (err) {
      res.status(500).json({ error: 'Internal server error, please reload' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid Employee ID' });
      return;
    }

    const user = results[0];
    if (password !== user.password) {
      res.status(401).json({ error: 'Invalid password' });
      return;
    }

    // User authenticated, generate token
    const token = jwt.sign({ employeeid: user.employeeid }, 'your_secret_key', { expiresIn: '1h' });
    res.status(200).json({ token });
  });
};

module.exports = { login };

// Assuming you have a table named 'products' in your database with columns 'id', 'name', 'image_url', etc.
const mysql = require('mysql');
  const connection = mysql.createConnection({
    host: 'localhost',
    port: '3306',
    user: 'root',
    password: '',
    database: 'iglooaml'
  });
// Get all products
const getAllProducts = (req, res) => {
    const query = 'SELECT * FROM products';
    connection.query(query, (err, results) => {
      if (err) {
        res.status(500).json({ error: 'Internal Server error' });
        return;
      }
      res.status(200).json(results);
    });
  };
  
  module.exports = { getAllProducts };
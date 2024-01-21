const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors({
  origin: 'http://localhost:3000', // Allow requests from this origin
  methods: ['GET', 'POST'],        // Allow specific HTTP methods
  allowedHeaders: ['Content-Type'], // Allow specific headers
}));

// MySQL connection setup
const mysql = require('mysql');
const connection = mysql.createConnection({
  host: 'localhost',
  port: '3306',
  user: 'root',
  password: '',
  database: 'iglooaml'
});

connection.connect(err => {
  if (err) {
    console.error('Error connecting to database:', err);
    return;
  }
  console.log('Connected to database');

  // Now you can execute queries or operations using `connection`
});
// Routes setup
const authRoutes = require('./routes/auth');
const productsRoutes = require('./routes/products');
const cartRoutes = require('./routes/order'); // Assume you have separate routes for cart-related operations

app.use('/auth', authRoutes);
app.use('/products', productsRoutes);
app.use('/payment', cartRoutes);

// Error handling middleware
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).send('We are here!');
// });
// app.post('/serialize', async (req, res) => {
//   try {
//     const { cartContent } = req.body;

//     // Make a POST request to the PHP endpoint
//     const response = await axios.post('http://localhost:80/serialize.php', { cartContent });
    
//     // Forward the serialized data received from PHP
//     res.send(response.data);
//   } catch (error) {
//     res.status(500).send('Internal Server Error');
//   }
// });
// Endpoint to fetch products based on search query
app.get('/products/search', (req, res) => {
  const { query } = req.query;
  console.log({ query }); 
  const sqlQuery = `SELECT * FROM products WHERE name LIKE '%${query}%'`; // Change 'name' to your column name

  connection.query(sqlQuery, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
   
    res.json(results); // Send the fetched products as JSON response
  });
});

// Start server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

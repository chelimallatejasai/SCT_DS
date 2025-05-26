const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
app.use(bodyParser.urlencoded({ extended: true }));  // Parse form data
app.use(express.static(path.join(__dirname)));

// Serve nodeyour login page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login.html'));
});

// Connect to MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',      // replace with your MySQL username
  password: 'tejasai',  // replace with your MySQL password
  database: 'mydatabase'
});

db.connect(err => {
  if (err) {
    console.error('MySQL connection error:', err);
    return;
  }
  console.log('Connected to MySQL');
});
app.post('/signup', (req, res) => {
  const { username, password, mobile, country, city } = req.body;

  const query = 'INSERT INTO users (username, password, mobile, country, city) VALUES (?, ?, ?, ?, ?)';
  db.query(query, [username, password, mobile, country, city], (err, result) => {
    if (err) {
      console.error('Error inserting into DB:', err);
      return res.status(500).send('Database error.');
    }
    res.redirect('/dashboard.html');
  });
});
// Handle login form POST request
app.post('/login', (req, res) => {
  const { username, password } = req.body;   // Read username and password from form

  // Query MySQL to find matching user
  const sql = 'SELECT * FROM users WHERE username = ? AND password = ?';
  db.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error('Database error:', err);
      res.send('Database error');
      return;
    }

    if (results.length > 0) {
      // Login success
     res.redirect('/dashboard.html');
    } else {
      // Login failed
      res.send('Invalid username or password');
    }
  });
});

app.listen(3000, () => {
  console.log('Server started at http://localhost:3000');
});
app.post('/adopt', (req, res) => {
  const { name, pet, email } = req.body;
  const query = 'INSERT INTO adoptions (name, pet, email) VALUES (?, ?, ?)';

  db.query(query, [name, pet, email], (err, result) => {
    if (err) {
      console.error('Adoption DB error:', err);
      return res.status(500).send('Database error');
    }
    res.send('Adoption request submitted successfully!');
  });
});
app.get('/get-pets', (req, res) => {
  const query = 'SELECT * FROM pets';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching pets:', err);
      return res.status(500).send('Database error');
    }
    res.json(results);
  });
});
app.post('/adopt', (req, res) => {
  const { user_name, email, pet_id } = req.body;
  const query = 'INSERT INTO adoptions (user_name, email, pet_id) VALUES (?, ?, ?)';
  db.query(query, [user_name, email, pet_id], (err, result) => {
    if (err) {
      console.error('Error saving adoption:', err);
      return res.status(500).send('Database error');
    }
    res.send('<h2>Thank you for adopting!</h2><a href="/dashboard.html">Go back</a>');
  });
});
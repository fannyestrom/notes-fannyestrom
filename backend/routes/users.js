const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const connection = require('../lib/conn');

// POST /users/signin, sign in existing account
router.post('/signin', function(req, res) {
  const { email, password, } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  connection.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error executing query:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }

    // check if user exists
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // compare password with hashed password from database
    const user = results[0];
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Invalid server error' });
      }

      if (!isValid) {
        return res.status(401).json({ error: 'Invalid password' });
      }

      const { password, ...userData } = user;
      res.status(200).json({ message: 'Sign-in successful', user: userData });
    });
  });
});

// POST /users/register, register a new user
router.post('/register', function(req, res) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

    // hash password
    bcrypt.hash(password, 10, function(err, hash) {
      if (err) {
        console.error('Error hashing password:', err);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // store user in database
      connection.query('INSERT INTO users (email, password) VALUES (?, ?)', [email, hash], (err, results) => {
       if (err) {
         console.error('Error executing query:', err);
          return res.status(500).json({ error: 'Internal server error' });
       }

        res.status(201).json({ message: 'User created successfully' });
    });
  });
});

module.exports = router;

import express, { Router } from "express";
import bcrypt from "bcrypt";
import pool from '../db/db.js';

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  
  // Check if all required fields are present
  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Username, email, and password are required' });
  }

  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Hash password
    let salt;
    try {
      salt = await bcrypt.genSalt(10);
    } catch (error) {
      console.error('Salt generation error:', error);
      return res.status(500).json({ message: 'Error in password processing' });
    }

    let hashedPassword;
    try {
      hashedPassword = await bcrypt.hash(password, salt);
    } catch (error) {
      console.error('Password hashing error:', error);
      return res.status(500).json({ message: 'Error in password processing' });
    }

    // Insert user into database
    const newUser = await pool.query(
      'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, username, email',
      [username, email, hashedPassword]
    );

    res.status(201).json({ 
      message: 'User created successfully',
      user: newUser.rows[0]
    });
  } catch (error) {
    console.error('Registration error:', error);
    
    if (error.code === '23505') {  // Unique violation error code
      return res.status(400).json({ message: 'Email or username already exists' });
    }
    
    res.status(500).json({ 
      message: 'Server error', 
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (user && await bcrypt.compare(password, user.password)) {
      req.session.userId = user.id;
      
      res.json({ message: 'Logged in successfully'});
      
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
export const logout = (req, res) => {
  req.session.destroy(err => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.json({ message: 'Logged out successfully' });
  });
};

export const dashboard = (req, res) => {
  // The userId is now available on req.userId
  res.json({ userId: req.userId, message: 'Welcome to the dashboard' });
};
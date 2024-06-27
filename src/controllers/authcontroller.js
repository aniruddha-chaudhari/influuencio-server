import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from './db.js'

const JWT_SECRET = process.env.JWT_SECRET;
const router = express.Router();

export const signup = async (req, res) => {
    try {
      const { username, email, password } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
  
      const query = 'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id';
      const values = [username, email, hashedPassword];
  
      const result = await pool.query(query, values);
      res.status(201).json({ message: 'User created successfully', userId: result.rows[0].id });
    } catch (error) {
      console.error('Signup error:', error);
      res.status(400).json({ error: error.message });
    }
  };

export const login = async (req, res) => {
    try {
      const { email, password } = req.body;
  
      const query = 'SELECT * FROM users WHERE email = $1';
      const result = await pool.query(query, [email]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      const user = result.rows[0];
      const validPassword = await bcrypt.compare(password, user.password);
  
      if (!validPassword) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '1h' });
      res.json({ message: 'Logged in successfully', token });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ error: error.message });
    }
  };
  
  export const getProfile = async (req, res) => {
    try {
      const userId = req.userId; // This comes from the verifyToken middleware
      const query = 'SELECT id, username, email FROM users WHERE id = $1';
      const result = await pool.query(query, [userId]);
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error fetching profile:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };


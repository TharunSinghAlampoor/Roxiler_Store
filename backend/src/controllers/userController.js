const bcrypt = require('bcryptjs');
const { validationResult } = require('express-validator');
const pool = require('../config/db');

// GET /api/users - list users with optional filters and sorting (admin only)
async function getUsers(req, res) {
  try {
    const { name, email, address, role, sortBy, order } = req.query;

    let query = 'SELECT id, name, email, address, role, created_at FROM users WHERE 1=1';
    let params = [];

    // apply filters
    if (name) {
      query += ' AND name LIKE ?';
      params.push('%' + name + '%');
    }
    if (email) {
      query += ' AND email LIKE ?';
      params.push('%' + email + '%');
    }
    if (address) {
      query += ' AND address LIKE ?';
      params.push('%' + address + '%');
    }
    if (role) {
      query += ' AND role = ?';
      params.push(role);
    }

    // sorting
    const allowedSortFields = ['id', 'name', 'email', 'address', 'role', 'created_at'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY ${sortBy} ${sortOrder}`;
    } else {
      query += ' ORDER BY created_at DESC';
    }

    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Failed to fetch users' });
  }
}

// GET /api/users/:id - get user details (admin only)
async function getUserById(req, res) {
  try {
    const [rows] = await pool.query(
      'SELECT id, name, email, address, role, created_at FROM users WHERE id = ?',
      [req.params.id]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    const user = rows[0];

    // if user is a store owner, also get their store rating
    if (user.role === 'OWNER') {
      const [storeRows] = await pool.query(
        `SELECT s.id, s.name, s.email, s.address,
         COALESCE(AVG(r.rating), 0) as averageRating
         FROM stores s
         LEFT JOIN ratings r ON r.store_id = s.id
         WHERE s.owner_id = ?
         GROUP BY s.id`,
        [user.id]
      );
      if (storeRows.length > 0) {
        user.store = storeRows[0];
      }
    }

    res.json(user);
  } catch (err) {
    console.error('Get user by id error:', err);
    res.status(500).json({ message: 'Failed to fetch user' });
  }
}

// POST /api/users - create a new user (admin only)
async function createUser(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, password, address, role } = req.body;

  // only allow valid roles
  const allowedRoles = ['ADMIN', 'USER', 'OWNER'];
  if (!allowedRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid role. Must be ADMIN, USER, or OWNER' });
  }

  try {
    // check duplicate email
    const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const [result] = await pool.query(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
      [name, email, hashedPassword, address, role]
    );

    res.status(201).json({ message: 'User created successfully', userId: result.insertId });
  } catch (err) {
    console.error('Create user error:', err);
    res.status(500).json({ message: 'Failed to create user' });
  }
}

module.exports = { getUsers, getUserById, createUser };

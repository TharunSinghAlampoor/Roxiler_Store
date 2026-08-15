const { validationResult } = require('express-validator');
const pool = require('../config/db');

// GET /api/stores - list all stores with ratings
// for normal users, also shows their submitted rating per store
async function getStores(req, res) {
  try {
    const { name, address, sortBy, order } = req.query;
    const userId = req.user.id;

    let query = `
      SELECT s.id, s.name, s.email, s.address, s.owner_id,
        COALESCE(AVG(r.rating), 0) as overallRating,
        (SELECT rating FROM ratings WHERE user_id = ? AND store_id = s.id) as userRating,
        (SELECT id FROM ratings WHERE user_id = ? AND store_id = s.id) as userRatingId
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    let params = [userId, userId];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push('%' + name + '%');
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push('%' + address + '%');
    }

    query += ' GROUP BY s.id';

    // sorting
    const allowedSortFields = ['name', 'email', 'address'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY s.${sortBy} ${sortOrder}`;
    } else if (sortBy === 'rating') {
      const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY overallRating ${sortOrder}`;
    } else {
      query += ' ORDER BY s.name ASC';
    }

    const [rows] = await pool.query(query, params);

    // round the rating to 1 decimal
    const stores = rows.map(store => ({
      ...store,
      overallRating: parseFloat(Number(store.overallRating).toFixed(1))
    }));

    res.json(stores);
  } catch (err) {
    console.error('Get stores error:', err);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
}

// GET /api/stores/admin - list stores for admin view (no user rating needed)
async function getStoresAdmin(req, res) {
  try {
    const { name, email, address, sortBy, order } = req.query;

    let query = `
      SELECT s.id, s.name, s.email, s.address,
        COALESCE(AVG(r.rating), 0) as rating
      FROM stores s
      LEFT JOIN ratings r ON r.store_id = s.id
      WHERE 1=1
    `;
    let params = [];

    if (name) {
      query += ' AND s.name LIKE ?';
      params.push('%' + name + '%');
    }
    if (email) {
      query += ' AND s.email LIKE ?';
      params.push('%' + email + '%');
    }
    if (address) {
      query += ' AND s.address LIKE ?';
      params.push('%' + address + '%');
    }

    query += ' GROUP BY s.id';

    const allowedSortFields = ['name', 'email', 'address'];
    if (sortBy && allowedSortFields.includes(sortBy)) {
      const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY s.${sortBy} ${sortOrder}`;
    } else if (sortBy === 'rating') {
      const sortOrder = order === 'desc' ? 'DESC' : 'ASC';
      query += ` ORDER BY rating ${sortOrder}`;
    } else {
      query += ' ORDER BY s.name ASC';
    }

    const [rows] = await pool.query(query, params);

    const stores = rows.map(store => ({
      ...store,
      rating: parseFloat(Number(store.rating).toFixed(1))
    }));

    res.json(stores);
  } catch (err) {
    console.error('Get stores admin error:', err);
    res.status(500).json({ message: 'Failed to fetch stores' });
  }
}

// POST /api/stores - create a new store (admin only)
async function createStore(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { name, email, address, ownerId } = req.body;

  try {
    // check if the owner exists and has role OWNER
    const [ownerRows] = await pool.query(
      'SELECT id, role FROM users WHERE id = ?',
      [ownerId]
    );
    if (ownerRows.length === 0) {
      return res.status(400).json({ message: 'Owner user not found' });
    }
    if (ownerRows[0].role !== 'OWNER') {
      return res.status(400).json({ message: 'Selected user is not a Store Owner' });
    }

    // check if owner already has a store
    const [existingStore] = await pool.query(
      'SELECT id FROM stores WHERE owner_id = ?',
      [ownerId]
    );
    if (existingStore.length > 0) {
      return res.status(400).json({ message: 'This owner already has a store assigned' });
    }

    // check duplicate store email
    const [existingEmail] = await pool.query(
      'SELECT id FROM stores WHERE email = ?',
      [email]
    );
    if (existingEmail.length > 0) {
      return res.status(400).json({ message: 'A store with this email already exists' });
    }

    const [result] = await pool.query(
      'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
      [name, email, address, ownerId]
    );

    res.status(201).json({ message: 'Store created successfully', storeId: result.insertId });
  } catch (err) {
    console.error('Create store error:', err);
    res.status(500).json({ message: 'Failed to create store' });
  }
}

module.exports = { getStores, getStoresAdmin, createStore };

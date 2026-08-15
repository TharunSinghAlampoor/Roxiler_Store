const { validationResult } = require('express-validator');
const pool = require('../config/db');

// POST /api/ratings - submit a rating for a store
async function submitRating(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { storeId, rating } = req.body;
  const userId = req.user.id;

  try {
    // check if store exists
    const [storeRows] = await pool.query('SELECT id FROM stores WHERE id = ?', [storeId]);
    if (storeRows.length === 0) {
      return res.status(404).json({ message: 'Store not found' });
    }

    // check if user already rated this store
    const [existing] = await pool.query(
      'SELECT id FROM ratings WHERE user_id = ? AND store_id = ?',
      [userId, storeId]
    );
    if (existing.length > 0) {
      return res.status(400).json({ message: 'You have already rated this store. Use the modify option instead.' });
    }

    await pool.query(
      'INSERT INTO ratings (user_id, store_id, rating) VALUES (?, ?, ?)',
      [userId, storeId, rating]
    );

    res.status(201).json({ message: 'Rating submitted successfully' });
  } catch (err) {
    console.error('Submit rating error:', err);
    res.status(500).json({ message: 'Failed to submit rating' });
  }
}

// PUT /api/ratings/:id - modify a submitted rating
async function modifyRating(req, res) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const ratingId = req.params.id;
  const { rating } = req.body;
  const userId = req.user.id;

  try {
    // make sure this rating belongs to the logged in user
    const [rows] = await pool.query(
      'SELECT id FROM ratings WHERE id = ? AND user_id = ?',
      [ratingId, userId]
    );
    if (rows.length === 0) {
      return res.status(404).json({ message: 'Rating not found or you do not own this rating' });
    }

    await pool.query('UPDATE ratings SET rating = ? WHERE id = ?', [rating, ratingId]);

    res.json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error('Modify rating error:', err);
    res.status(500).json({ message: 'Failed to update rating' });
  }
}

// GET /api/ratings/store/:storeId - get all ratings for a store (for store owner)
async function getStoreRatings(req, res) {
  try {
    const storeId = req.params.storeId;

    const [rows] = await pool.query(
      `SELECT r.id, r.rating, r.created_at, r.updated_at,
              u.name as userName, u.email as userEmail
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [storeId]
    );

    res.json(rows);
  } catch (err) {
    console.error('Get store ratings error:', err);
    res.status(500).json({ message: 'Failed to fetch ratings' });
  }
}

module.exports = { submitRating, modifyRating, getStoreRatings };

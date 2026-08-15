const pool = require('../config/db');

// GET /api/dashboard/admin - get counts for admin dashboard
async function getAdminDashboard(req, res) {
  try {
    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    const [storeCount] = await pool.query('SELECT COUNT(*) as count FROM stores');
    const [ratingCount] = await pool.query('SELECT COUNT(*) as count FROM ratings');

    res.json({
      totalUsers: userCount[0].count,
      totalStores: storeCount[0].count,
      totalRatings: ratingCount[0].count
    });
  } catch (err) {
    console.error('Admin dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
}

// GET /api/dashboard/owner - get store owner's dashboard info
async function getOwnerDashboard(req, res) {
  try {
    const ownerId = req.user.id;

    // find the store owned by this user
    const [storeRows] = await pool.query(
      'SELECT id, name FROM stores WHERE owner_id = ?',
      [ownerId]
    );

    if (storeRows.length === 0) {
      return res.json({
        storeName: null,
        averageRating: 0,
        raters: []
      });
    }

    const store = storeRows[0];

    // get average rating
    const [avgRows] = await pool.query(
      'SELECT COALESCE(AVG(rating), 0) as avgRating FROM ratings WHERE store_id = ?',
      [store.id]
    );

    // get list of users who rated
    const [raters] = await pool.query(
      `SELECT u.name, u.email, r.rating, r.created_at
       FROM ratings r
       JOIN users u ON u.id = r.user_id
       WHERE r.store_id = ?
       ORDER BY r.created_at DESC`,
      [store.id]
    );

    res.json({
      storeName: store.name,
      averageRating: parseFloat(Number(avgRows[0].avgRating).toFixed(1)),
      raters
    });
  } catch (err) {
    console.error('Owner dashboard error:', err);
    res.status(500).json({ message: 'Failed to load dashboard data' });
  }
}

module.exports = { getAdminDashboard, getOwnerDashboard };

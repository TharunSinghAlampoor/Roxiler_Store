const express = require('express');
const router = express.Router();
const { getAdminDashboard, getOwnerDashboard } = require('../controllers/dashboardController');
const { authenticate, authorize } = require('../middleware/auth');

// GET /api/dashboard/admin
router.get('/admin', authenticate, authorize('ADMIN'), getAdminDashboard);

// GET /api/dashboard/owner
router.get('/owner', authenticate, authorize('OWNER'), getOwnerDashboard);

module.exports = router;

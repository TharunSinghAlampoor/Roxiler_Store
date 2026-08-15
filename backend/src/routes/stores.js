const express = require('express');
const router = express.Router();
const { getStores, getStoresAdmin, createStore } = require('../controllers/storeController');
const { authenticate, authorize } = require('../middleware/auth');
const { emailRules, addressRules } = require('../middleware/validate');
const { body } = require('express-validator');

// GET /api/stores - for normal users (shows their rating)
router.get('/', authenticate, getStores);

// GET /api/stores/admin - for admin view
router.get('/admin', authenticate, authorize('ADMIN'), getStoresAdmin);

// POST /api/stores - admin creates a store
router.post(
  '/',
  authenticate,
  authorize('ADMIN'),
  [
    body('name').trim().notEmpty().withMessage('Store name is required'),
    ...emailRules,
    ...addressRules,
    body('ownerId').isInt().withMessage('Owner ID must be a number')
  ],
  createStore
);

module.exports = router;

const express = require('express');
const router = express.Router();
const { submitRating, modifyRating, getStoreRatings } = require('../controllers/ratingController');
const { authenticate, authorize } = require('../middleware/auth');
const { ratingRules } = require('../middleware/validate');
const { body } = require('express-validator');

// POST /api/ratings - normal user submits a rating
router.post(
  '/',
  authenticate,
  authorize('USER'),
  [
    body('storeId').isInt().withMessage('Store ID is required'),
    ...ratingRules
  ],
  submitRating
);

// PUT /api/ratings/:id - normal user modifies their rating
router.put(
  '/:id',
  authenticate,
  authorize('USER'),
  [...ratingRules],
  modifyRating
);

// GET /api/ratings/store/:storeId - store owner views ratings
router.get(
  '/store/:storeId',
  authenticate,
  authorize('OWNER'),
  getStoreRatings
);

module.exports = router;

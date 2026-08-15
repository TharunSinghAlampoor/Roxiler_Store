const express = require('express');
const router = express.Router();
const { signup, login, getMe, changePassword } = require('../controllers/authController');
const { authenticate } = require('../middleware/auth');
const { nameRules, emailRules, passwordRules, addressRules } = require('../middleware/validate');
const { body } = require('express-validator');

// POST /api/auth/signup
router.post(
  '/signup',
  [...nameRules, ...emailRules, ...passwordRules, ...addressRules],
  signup
);

// POST /api/auth/login
router.post(
  '/login',
  [
    body('email').trim().isEmail().withMessage('Please enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
  ],
  login
);

// GET /api/auth/me
router.get('/me', authenticate, getMe);

// PUT /api/auth/password
router.put(
  '/password',
  authenticate,
  [
    body('currentPassword').notEmpty().withMessage('Current password is required'),
    body('newPassword')
      .isLength({ min: 8 }).withMessage('New password must be at least 8 characters')
      .isLength({ max: 16 }).withMessage('New password must not exceed 16 characters')
      .matches(/[A-Z]/).withMessage('New password must contain at least one uppercase letter')
      .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('New password must contain at least one special character')
  ],
  changePassword
);

module.exports = router;

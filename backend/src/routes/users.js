const express = require('express');
const router = express.Router();
const { getUsers, getUserById, createUser } = require('../controllers/userController');
const { authenticate, authorize } = require('../middleware/auth');
const { nameRules, emailRules, passwordRules, addressRules } = require('../middleware/validate');
const { body } = require('express-validator');

// all user routes need admin access
router.use(authenticate, authorize('ADMIN'));

// GET /api/users
router.get('/', getUsers);

// GET /api/users/:id
router.get('/:id', getUserById);

// POST /api/users
router.post(
  '/',
  [
    ...nameRules,
    ...emailRules,
    ...passwordRules,
    ...addressRules,
    body('role').isIn(['ADMIN', 'USER', 'OWNER']).withMessage('Role must be ADMIN, USER, or OWNER')
  ],
  createUser
);

module.exports = router;

const { body } = require('express-validator');

// name must be between 20 and 60 characters
const nameRules = [
  body('name')
    .trim()
    .isLength({ min: 20 }).withMessage('Name must be at least 20 characters')
    .isLength({ max: 60 }).withMessage('Name must not exceed 60 characters')
];

// standard email check
const emailRules = [
  body('email')
    .trim()
    .isEmail().withMessage('Please enter a valid email address')
    .normalizeEmail()
];

// password: 8-16 chars, at least 1 uppercase, at least 1 special character
const passwordRules = [
  body('password')
    .isLength({ min: 8 }).withMessage('Password must be at least 8 characters')
    .isLength({ max: 16 }).withMessage('Password must not exceed 16 characters')
    .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
    .matches(/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/).withMessage('Password must contain at least one special character')
];

// address max 400 chars
const addressRules = [
  body('address')
    .trim()
    .isLength({ max: 400 }).withMessage('Address must not exceed 400 characters')
];

// rating between 1 and 5
const ratingRules = [
  body('rating')
    .isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5')
];

module.exports = {
  nameRules,
  emailRules,
  passwordRules,
  addressRules,
  ratingRules
};

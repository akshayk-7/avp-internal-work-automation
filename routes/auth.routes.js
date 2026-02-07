const express = require('express');
const router = express.Router();
const { registerOffice, login } = require('../controllers/auth.controller');

// @route   POST /api/auth/register-office
// @desc    Register a new office and its CEO
// @access  Public
router.post('/register-office', registerOffice);

// @route   POST /api/auth/login
// @desc    Login user and get token
// @access  Public
router.post('/login', login);

module.exports = router;

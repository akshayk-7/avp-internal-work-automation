const express = require('express');
const router = express.Router();
const healthController = require('../controllers/health.controller');

// @route   GET /health
// @desc    Check health of the server and database
// @access  Public
router.get('/', healthController.getHealth);

module.exports = router;

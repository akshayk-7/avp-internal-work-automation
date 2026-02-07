const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth.middleware');

// @route   GET /api/test/ceo-only
// @desc    A route only accessible by CEO
// @access  Private (CEO)
router.get('/ceo-only', protect, authorize('CEO'), (req, res) => {
    res.json({
        message: 'Welcome CEO',
        user: req.user
    });
});

// @route   GET /api/test/any-staff
// @desc    A route accessible by any authenticated user
// @access  Private
router.get('/any-staff', protect, (req, res) => {
    res.json({
        message: 'Access granted to staff',
        user: req.user
    });
});

module.exports = router;

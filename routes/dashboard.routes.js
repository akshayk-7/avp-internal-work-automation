const express = require('express');
const router = express.Router();
const {
    getCEODashboard,
    getAODashboard,
    getOADashboard
} = require('../controllers/dashboard.controller');
const { protect, authorize } = require('../middleware/auth.middleware');

// All dashboard routes are protected
router.use(protect);

router.get('/ceo', authorize('CEO'), getCEODashboard);
router.get('/ao', authorize('AO', 'CEO'), getAODashboard);
router.get('/oa', getOADashboard); // Any OA can see their own dashboard

module.exports = router;

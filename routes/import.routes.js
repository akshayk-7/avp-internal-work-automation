const express = require('express');
const router = express.Router();
const { uploadAndPreview, confirmImport } = require('../controllers/import.controller');
const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Protected routes
router.use(protect);

/**
 * @route   POST /api/imports/upload
 * @desc    Upload file and get preview
 * @access  Private
 */
router.post('/upload', upload.single('file'), uploadAndPreview);

/**
 * @route   POST /api/imports/confirm
 * @desc    Confirm and execute the import
 * @access  Private
 */
router.post('/confirm', confirmImport);

module.exports = router;

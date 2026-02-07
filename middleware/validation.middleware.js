const { validationResult } = require('express-validator');

/**
 * @desc    Format and return validation errors
 */
const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            status: 'fail',
            message: 'Validation Error',
            errors: errors.array(),
        });
    }
    next();
};

module.exports = validate;

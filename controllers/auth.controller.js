const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');

/**
 * @desc    Generate JWT
 * @param   {Object} user - User object
 * @returns {string} Token
 */
const generateToken = (user) => {
    return jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role,
            office_id: user.office_id
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    );
};

/**
 * @desc    Register Office + CEO
 * @route   POST /api/auth/register-office
 * @access  Public
 */
const registerOffice = async (req, res) => {
    const { office_name, office_address, ceo_name, ceo_email, password } = req.body;

    if (!office_name || !ceo_name || !ceo_email || !password) {
        return res.status(400).json({ message: 'Please provide all required fields' });
    }

    const client = await db.pool.connect();

    try {
        await client.query('BEGIN');

        // 1. Create Office
        const officeRes = await client.query(
            'INSERT INTO offices (name, address) VALUES ($1, $2) RETURNING id',
            [office_name, office_address]
        );
        const officeId = officeRes.rows[0].id;

        // 2. Hash Password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 3. Create CEO User
        const userRes = await client.query(
            'INSERT INTO users (office_id, full_name, email, password_hash, role) VALUES ($1, $2, $3, $4, $5) RETURNING id, full_name, email, role, office_id',
            [officeId, ceo_name, ceo_email, hashedPassword, 'CEO']
        );
        const user = userRes.rows[0];

        await client.query('COMMIT');

        res.status(201).json({
            status: 'success',
            data: {
                user,
                token: generateToken(user)
            }
        });

    } catch (error) {
        await client.query('ROLLBACK');
        console.error(error);

        if (error.code === '23505') { // Unique constraint violation
            return res.status(400).json({ message: 'User with this email already exists' });
        }

        res.status(500).json({ message: 'Server error during registration' });
    } finally {
        client.release();
    }
};

/**
 * @desc    Login User
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Please provide email and password' });
    }

    try {
        const userRes = await db.query(
            'SELECT id, email, password_hash, full_name, role, office_id FROM users WHERE email = $1 AND is_active = true',
            [email]
        );

        if (userRes.rows.length === 0) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const user = userRes.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Remove password from response
        delete user.password_hash;

        res.status(200).json({
            status: 'success',
            data: {
                user,
                token: generateToken(user)
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error during login' });
    }
};

module.exports = {
    registerOffice,
    login
};

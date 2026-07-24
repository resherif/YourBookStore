const pool = require('../model/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handlesignUp = async (req, res) => {
    const { name, email, password, pwd, role } = req.body;
    const finalPassword = password || pwd;

    if (!name || !finalPassword || !email) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const checkDuplicates = await pool.query('SELECT id FROM users WHERE name=$1 OR email=$2', [name, email]);
        if (checkDuplicates.rows.length > 0) {
            return res.status(409).json({ "message": "name or Email already exists" });
        }

        const hashedpwd = await bcrypt.hash(finalPassword, 10);
        const userRole = role || 'customer';

        const queryText = `
            INSERT INTO users (name, email, password, role)
            VALUES ($1, $2, $3, $4)
            RETURNING id, name, email, role`;
        const values = [name, email, hashedpwd, userRole];

        const result = await pool.query(queryText, values);
        const newUser = result.rows[0];

        
        const accessToken = jwt.sign(
            {
                "id": newUser.id,
                "role": newUser.role
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );

        const refreshToken = jwt.sign(
            { "id": newUser.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

    
        const updateTokenQuery = 'UPDATE users SET refresh_token=$1 WHERE id=$2';
        await pool.query(updateTokenQuery, [refreshToken, newUser.id]);
        
        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            path: '/',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(201).json({
            message: "Account has been created!",
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role
            },
            accessToken: accessToken,
        });
    } catch (err) {
        res.status(500).json({ "message": err.message });
    }
};

module.exports = handlesignUp;
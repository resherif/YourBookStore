const pool = require('../model/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const handleLogin = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'please enter password and email!' });
    }

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.status(401).json({ message: 'Email or password are not valid' });
        }

        const user = result.rows[0];
        if (!user.password) {
            return res.status(401).json({ message: 'Email or password are not valid' });
        }

        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(401).json({ message: 'Email or password are not valid' });
        }

        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '15m' }
        );
        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        );

        await pool.query('UPDATE users SET refresh_token = $1 WHERE id = $2', [refreshToken, user.id]);

        res.cookie('jwt', refreshToken, {
            httpOnly: true,
            sameSite:process.env.NODE_ENV === 'production' ? 'None' : 'Lax',
            secure: process.env.NODE_ENV === 'production',
            maxAge: 24 * 60 * 60 * 1000
        });

        res.status(200).json({
            message: 'Logged in successfully!',
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            },
            accessToken
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error while trying sign you in!' });
    }
};

module.exports = handleLogin;
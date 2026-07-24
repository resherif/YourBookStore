const crypto = require('crypto');
const bcrypt = require('bcrypt');
const pool = require('../model/db');

const requestPasswordReset = async (req, res) => {
  try {
    const email = String(req.body?.email || '').trim().toLowerCase();
    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const result = await pool.query('SELECT id, email FROM users WHERE LOWER(email) = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(200).json({
        message: 'If that email exists, a reset link has been prepared.'
      });
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    const resetExpiresAt = new Date(Date.now() + 15 * 60 * 1000);

    await pool.query(
      'UPDATE users SET reset_token = $1, reset_expires_at = $2 WHERE id = $3',
      [resetToken, resetExpiresAt, result.rows[0].id]
    );

    return res.status(200).json({
      message: 'If that email exists, a reset link has been prepared.',
      resetToken
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to process password reset right now.' });
  }
};

const resetPassword = async (req, res) => {
  try {
    const token = String(req.body?.token || '').trim();
    const password = String(req.body?.password || '').trim();
    if (!token || !password) {
      return res.status(400).json({ message: 'Reset token and new password are required.' });
    }

    const result = await pool.query(
      'SELECT id FROM users WHERE reset_token = $1 AND reset_expires_at > NOW()',
      [token]
    );

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Reset token is invalid or expired.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await pool.query(
      'UPDATE users SET password = $1, reset_token = NULL, reset_expires_at = NULL WHERE id = $2',
      [hashedPassword, result.rows[0].id]
    );

    return res.status(200).json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Unable to reset password right now.' });
  }
};

module.exports = { requestPasswordReset, resetPassword };
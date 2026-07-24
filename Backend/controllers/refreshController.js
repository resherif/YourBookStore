const jwt = require('jsonwebtoken');
const pool = require('../model/db');

const refreshController = async (req, res) => {
  const cookies = req.cookies || {};
  const refreshToken = cookies.jwt;

  if (!refreshToken) {
    return res.status(204).end();
  }

  try {
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const result = await pool.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
    if (result.rows.length === 0) {
      return res.status(204).end();
    }

    const user = result.rows[0];
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    return res.status(200).json({ accessToken });
  } catch (err) {
    console.warn('Refresh token invalid or expired');
    return res.status(204).end();
  }
};

module.exports = refreshController;

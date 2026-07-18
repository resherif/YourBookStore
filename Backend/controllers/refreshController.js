const jwt = require('jsonwebtoken');
const pool = require('../model/db');

const refreshController = async (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.status(401).json({ message: 'No refresh token' });
  }

  const refreshToken = cookies.jwt;

  try {
    const result = await pool.query('SELECT * FROM users WHERE refresh_token = $1', [refreshToken]);
    if (result.rows.length === 0) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    const user = result.rows[0];
    jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '15m' }
    );

    res.status(200).json({ accessToken });
  } catch (err) {
    console.error(err);
    res.status(403).json({ message: 'Invalid refresh token' });
  }
};

module.exports = refreshController;

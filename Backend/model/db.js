const { Pool } = require('pg');
require('dotenv').config(); 
const pool = new Pool({
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  database: process.env.DB_DATABASE,
});

const ensureUserAuthColumns = async () => {
  try {
    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password TEXT,
      ADD COLUMN IF NOT EXISTS refresh_token TEXT;
    `);
    console.log('Auth columns verified for users table');
  } catch (err) {
    console.error('Failed to verify auth columns:', err.message);
  }
};

pool.connect((err, client, release) => {
  if (err) {
    return console.error('Error acquiring client', err.stack);
  }
  console.log('Successfully connected to PostgreSQL Database!');
  release();
});

module.exports = pool;
module.exports.ensureUserAuthColumns = ensureUserAuthColumns;
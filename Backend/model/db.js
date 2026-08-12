const path = require('path');
const { Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false 
  }
});

const ensureUserAuthColumns = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name TEXT,
        email TEXT UNIQUE,
        password TEXT,
        role TEXT DEFAULT 'customer',
        refresh_token TEXT
      );
    `);

    await pool.query(`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS password TEXT,
      ADD COLUMN IF NOT EXISTS refresh_token TEXT,
      ADD COLUMN IF NOT EXISTS reset_token TEXT,
      ADD COLUMN IF NOT EXISTS reset_expires_at TIMESTAMP;
    `);
    console.log('Auth columns verified for users table');
  } catch (err) {
    console.error('Failed to verify auth columns:', err.message);
  }
};

pool.query('SELECT NOW()')
  .then(() => {
    console.log('Successfully connected to PostgreSQL Database!');
  })
  .catch((err) => {
    console.error('Error acquiring client', err.message);
  });

module.exports = pool;
module.exports.ensureUserAuthColumns = ensureUserAuthColumns;
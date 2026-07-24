const { Client } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
(async () => {
  const client = new Client({
    user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT || 5432),
  database: process.env.DB_DATABASE,
  });

  try {
    await client.connect();
    const res = await client.query('SELECT reset_token, reset_expires_at FROM users WHERE email = $1', ['reham@example.com']);
    console.log(JSON.stringify(res.rows, null, 2));
  } catch (err) {
    console.error(err);
    process.exit(1);
  } finally {
    await client.end();
  }
})();

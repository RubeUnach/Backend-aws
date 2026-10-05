const { Pool } = require('pg');
const env = require('./env');

const pool = new Pool({
  host: env.database.host,
  port: env.database.port,
  database: env.database.name,
  user: env.database.user,
  password: env.database.password,

  max: 10,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 5000
});

pool.on('error', (error) => {
  console.error(
    'Error inesperado en el pool de PostgreSQL:',
    error.message
  );
});

async function testDatabaseConnection() {
  const result = await pool.query(`
    SELECT
      current_user,
      current_database()
  `);

  return result.rows[0];
}

module.exports = {
  pool,
  testDatabaseConnection
};
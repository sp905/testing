const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected idle client error', err);
  process.exit(-1);
});

const tool = {
  query: async (text, params) => await pool.query(text, params),
  pool,
};

module.exports = tool;
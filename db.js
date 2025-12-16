import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

pool.on('error', (err) => {
  console.error('Unexpected idle client error', err);
  process.exit(-1);
});

const tool = {
  query: (text, params) => pool.query(text, params),
  pool,
};

export default tool;
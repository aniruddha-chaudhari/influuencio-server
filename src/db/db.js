import pg from 'pg';
const { Pool } = pg;

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'influeencio',
  password: '1234',
  port: 5432, // Default PostgreSQL port
});

pool.on('connect', () => {
  console.log('Connected to the PostgreSQL database');
});

// Function to check the database connection
const checkDbConnection = async () => {
  try {
    await pool.query('SELECT NOW()');
    console.log('Database connection is successful');
  } catch (err) {
    console.error('Database connection failed', err);
  }
};

// Run the check when the module is loaded
checkDbConnection();

export default Pool;

const pool = require('../config/db');

async function remove() {
  try {
    const [result] = await pool.query("DELETE FROM users WHERE email IN ('vikram@gmail.com', 'ananya@gmail.com')");
    console.log('Deleted ' + result.affectedRows + ' normal test users.');
    process.exit(0);
  } catch (err) {
    console.error('Error:', err.message);
    process.exit(1);
  }
}

remove();

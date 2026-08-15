const pool = require('../config/db');

async function updateAdminEmail() {
  try {
    const [result] = await pool.query(
      "UPDATE users SET email = 'admin@roxiler.com', address = 'Roxiler HQ, Main Street' WHERE email = 'admin@roxilor.com' OR role = 'ADMIN'"
    );
    console.log('Admin email updated successfully to admin@roxiler.com! Rows affected:', result.affectedRows);
    process.exit(0);
  } catch (err) {
    console.error('Update error:', err);
    process.exit(1);
  }
}

updateAdminEmail();

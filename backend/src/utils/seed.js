const bcrypt = require('bcryptjs');
const pool = require('../config/db');

// seed an initial admin user so you can login for the first time
async function seed() {
  try {
    // check if any admin already exists
    const [rows] = await pool.query("SELECT id FROM users WHERE role = 'ADMIN' LIMIT 1");
    if (rows.length > 0) {
      console.log('Admin user already exists, skipping seed.');
      process.exit(0);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Admin@1234', salt);

    await pool.query(
      'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
      ['System Administrator User', 'admin@roxiler.com', hashedPassword, 'Roxiler Corporate Towers, Suite 500, Tech Park Road, Bengaluru, Karnataka 560100', 'ADMIN']
    );

    console.log('Admin user seeded successfully!');
    console.log('Email: admin@roxiler.com');
    console.log('Password: Admin@1234');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err);
    process.exit(1);
  }
}

seed();

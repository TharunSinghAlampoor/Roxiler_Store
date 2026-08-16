const pool = require('../config/db');

async function removeTargetUsers() {
  try {
    const emails = [
      'testuserone@example.com',
      'testuser@example.com',
      'john.doe.wash@example.com'
    ];

    // Get matching users
    const [users] = await pool.query('SELECT id, name, email FROM users WHERE email IN (?)', [emails]);
    
    if (users.length === 0) {
      console.log('No matching test users found in database.');
      process.exit(0);
    }

    const userIds = users.map(u => u.id);
    console.log('Found users to delete:', users.map(u => `${u.name} (${u.email})`));

    // Delete associated ratings first if any exist
    const [ratingResult] = await pool.query('DELETE FROM ratings WHERE user_id IN (?)', [userIds]);
    console.log(`Deleted ${ratingResult.affectedRows} associated ratings.`);

    // Delete target users
    const [userResult] = await pool.query('DELETE FROM users WHERE id IN (?)', [userIds]);
    console.log(`Deleted ${userResult.affectedRows} target users successfully.`);

    process.exit(0);
  } catch (err) {
    console.error('Failed to delete target test users:', err.message);
    process.exit(1);
  }
}

removeTargetUsers();

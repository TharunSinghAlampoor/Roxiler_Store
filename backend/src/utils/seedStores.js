const bcrypt = require('bcryptjs');
const pool = require('../config/db');

async function seedStores() {
  try {
    const salt = await bcrypt.genSalt(10);

    // create store owner users
    const owners = [
      {
        name: 'Rajesh Kumar Electronics Owner',
        email: 'rajesh@techworld.com',
        password: 'Rajesh@123',
        address: '45 MG Road, Bengaluru, Karnataka 560001'
      },
      {
        name: 'Priya Sharma Fashion Store',
        email: 'priya@fashionhub.com',
        password: 'Priya@1234',
        address: '12 Park Street, Kolkata, West Bengal 700016'
      },
      {
        name: 'Amit Patel Grocery Mart Owner',
        email: 'amit@freshmart.com',
        password: 'Amit@12345',
        address: '78 SG Highway, Ahmedabad, Gujarat 380054'
      },
      {
        name: 'Sneha Reddy Book Store Owner',
        email: 'sneha@bookparadise.com',
        password: 'Sneha@1234',
        address: '23 Jubilee Hills, Hyderabad, Telangana 500033'
      },
      {
        name: 'Mohammed Irfan Sports Zone',
        email: 'irfan@sportszone.com',
        password: 'Irfan@1234',
        address: '56 Anna Nagar, Chennai, Tamil Nadu 600040'
      }
    ];

    // stores to create (linked to owners above)
    const stores = [
      {
        name: 'TechWorld Electronics',
        email: 'store@techworld.com',
        address: '45 MG Road, Ground Floor, Bengaluru, Karnataka 560001',
        ownerEmail: 'rajesh@techworld.com'
      },
      {
        name: 'Fashion Hub',
        email: 'store@fashionhub.com',
        address: '12 Park Street, 2nd Floor, Kolkata, West Bengal 700016',
        ownerEmail: 'priya@fashionhub.com'
      },
      {
        name: 'FreshMart Groceries',
        email: 'store@freshmart.com',
        address: '78 SG Highway, Shop No 4, Ahmedabad, Gujarat 380054',
        ownerEmail: 'amit@freshmart.com'
      },
      {
        name: 'Book Paradise',
        email: 'store@bookparadise.com',
        address: '23 Jubilee Hills, Near City Center Mall, Hyderabad, Telangana 500033',
        ownerEmail: 'sneha@bookparadise.com'
      },
      {
        name: 'Sports Zone Arena',
        email: 'store@sportszone.com',
        address: '56 Anna Nagar, 1st Main Road, Chennai, Tamil Nadu 600040',
        ownerEmail: 'irfan@sportszone.com'
      }
    ];

    // also create a couple of normal users for testing
    const normalUsers = [
      {
        name: 'Vikram Singh Test Normal User',
        email: 'vikram@gmail.com',
        password: 'Vikram@123',
        address: '90 Connaught Place, New Delhi 110001'
      },
      {
        name: 'Ananya Mishra Normal Tester',
        email: 'ananya@gmail.com',
        password: 'Ananya@123',
        address: '34 Bandra West, Mumbai, Maharashtra 400050'
      }
    ];

    console.log('Creating store owner accounts...');
    for (const owner of owners) {
      const hashedPassword = await bcrypt.hash(owner.password, salt);
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [owner.email]);
      if (existing.length > 0) {
        console.log(`  Owner ${owner.email} already exists, skipping.`);
        continue;
      }
      await pool.query(
        'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
        [owner.name, owner.email, hashedPassword, owner.address, 'OWNER']
      );
      console.log(`  Created owner: ${owner.email}`);
    }

    console.log('\nCreating stores...');
    for (const store of stores) {
      const [ownerRows] = await pool.query('SELECT id FROM users WHERE email = ?', [store.ownerEmail]);
      if (ownerRows.length === 0) {
        console.log(`  Owner ${store.ownerEmail} not found, skipping store ${store.name}`);
        continue;
      }
      const ownerId = ownerRows[0].id;

      const [existingStore] = await pool.query('SELECT id FROM stores WHERE email = ?', [store.email]);
      if (existingStore.length > 0) {
        console.log(`  Store ${store.email} already exists, skipping.`);
        continue;
      }

      await pool.query(
        'INSERT INTO stores (name, email, address, owner_id) VALUES (?, ?, ?, ?)',
        [store.name, store.email, store.address, ownerId]
      );
      console.log(`  Created store: ${store.name}`);
    }

    console.log('\nCreating normal test users...');
    for (const user of normalUsers) {
      const hashedPassword = await bcrypt.hash(user.password, salt);
      const [existing] = await pool.query('SELECT id FROM users WHERE email = ?', [user.email]);
      if (existing.length > 0) {
        console.log(`  User ${user.email} already exists, skipping.`);
        continue;
      }
      await pool.query(
        'INSERT INTO users (name, email, password_hash, address, role) VALUES (?, ?, ?, ?, ?)',
        [user.name, user.email, hashedPassword, user.address, 'USER']
      );
      console.log(`  Created user: ${user.email}`);
    }

    console.log('\nDone! All profiles created.');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seedStores();

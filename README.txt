===============================================================================
ROXILER STORE & USER MANAGEMENT PLATFORM
Setup Guide, App Instructions & Login Credentials
===============================================================================

1. PROJECT OVERVIEW
-------------------------------------------------------------------------------
The application is a full-stack Store & Rating Management System built with:
  - Frontend: React (Vite), JavaScript, Vanilla CSS, React Router
  - Backend: Node.js, Express, MySQL, JWT Authentication, bcryptjs
  - Features: Multi-role system (ADMIN, OWNER, USER), store searching & filtering,
    star rating submission, user directories, password policies & dashboard metrics.


2. HOW TO SET UP & RUN THE APPLICATION
-------------------------------------------------------------------------------
Prerequisites:
  - Node.js (v18 or higher recommended)
  - MySQL Server (running on localhost:3306)

Step A: Database & Backend Configuration
  1. Navigate to the backend directory:
     cd backend

  2. Install dependencies:
     npm install

  3. Configure environment variables in backend/.env:
     PORT=5000
     DB_HOST=localhost
     DB_USER=root
     DB_PASSWORD=your_mysql_password
     DB_NAME=roxiler_db
     JWT_SECRET=your_secret_jwt_key_here

  4. Create the MySQL Database & Schema:
     Execute the schema from backend/src/config/schema.sql in your MySQL client.

  5. Seed Default Data (Admin, Store Owners, Stores & Users):
     node src/utils/seed.js        (Creates initial System Administrator)
     node src/utils/seedStores.js  (Creates Store Owners, Stores & Test Users)

  6. Start Backend Server:
     npm run dev
     -> Server runs at: http://localhost:5000

Step B: Frontend Setup
  1. Navigate to the frontend directory:
     cd frontend

  2. Install dependencies:
     npm install

  3. Start Frontend Development Server:
     npm run dev
     -> App runs at: http://localhost:5173


3. LOGIN CREDENTIALS BY ROLE
-------------------------------------------------------------------------------

[SYSTEM ADMINISTRATOR (ADMIN)]
  - Email:    admin@roxiler.com
  - Password: Admin@1234
  - Capabilities:
      • Manage Users (Filter, Search, Sort & Add System Admins, Owners, Users)
      • Manage Stores (Filter, Search, Sort & Add Stores)
      • View System-wide Dashboard Metrics (Total Users, Total Stores, Total Ratings)

[STORE OWNERS (OWNER)]
  1. TechWorld Electronics Owner
     - Email:    rajesh@techworld.com
     - Password: Rajesh@123
     - Store:    TechWorld Electronics

  2. Fashion Hub Owner
     - Email:    priya@fashionhub.com
     - Password: Priya@1234
     - Store:    Fashion Hub

  3. FreshMart Groceries Owner
     - Email:    amit@freshmart.com
     - Password: Amit@12345
     - Store:    FreshMart Groceries

  4. Book Paradise Owner
     - Email:    sneha@bookparadise.com
     - Password: Sneha@1234
     - Store:    Book Paradise

  5. Sports Zone Arena Owner
     - Email:    irfan@sportszone.com
     - Password: Irfan@1234
     - Store:    Sports Zone Arena

  - Capabilities:
      • View Owner Dashboard with store average rating & total reviews
      • Inspect customer rating submissions and search/sort feedback
      • Modify account password

[NORMAL USERS (USER)]
  1. Vikram Singh
     - Email:    vikram@gmail.com
     - Password: Vikram@123

  2. Ananya Mishra
     - Email:    ananya@gmail.com
     - Password: Ananya@123

  - Capabilities:
      • View list of available stores and search by name or address/city
      • Submit and update 1 to 5 star ratings per store
      • Modify account password


4. SYSTEM VALIDATION RULES & POLICIES
-------------------------------------------------------------------------------
  - Full Name Length: 20 to 60 characters
  - Password Criteria: 8 to 16 characters, must contain at least 1 uppercase
    letter (A-Z) and 1 special character (!@#$%^&*...)
  - Address Limit: Maximum 400 characters
  - Email: Must be valid email address format and unique per user/store
===============================================================================

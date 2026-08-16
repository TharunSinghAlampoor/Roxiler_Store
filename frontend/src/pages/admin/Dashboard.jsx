import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  async function fetchStats() {
    try {
      const res = await api.get('/dashboard/admin');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading dashboard overview...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Admin Dashboard</h1>
          <p className="page-subtitle">Overview of platform metrics and quick management actions</p>
        </div>
        <div className="btn-group">
          <Link to="/admin/users/new" className="btn btn-primary">Add New User</Link>
          <Link to="/admin/stores/new" className="btn btn-success">Add New Store</Link>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="stat-card stat-users">
          <div>
            <div className="stat-label">Total Users</div>
            <div className="stat-value">{stats.totalUsers}</div>
          </div>
          <div className="stat-subtext">Registered administrators, store owners, and users</div>
        </div>

        <div className="stat-card stat-stores">
          <div>
            <div className="stat-label">Total Stores</div>
            <div className="stat-value">{stats.totalStores}</div>
          </div>
          <div className="stat-subtext">Active retail & service stores on the platform</div>
        </div>

        <div className="stat-card stat-ratings">
          <div>
            <div className="stat-label">Total Ratings</div>
            <div className="stat-value">{stats.totalRatings}</div>
          </div>
          <div className="stat-subtext">Reviews submitted by normal users</div>
        </div>
      </div>

      <div className="card">
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '14px', color: 'var(--text-main)' }}>
          Quick Navigation
        </h2>
        <div className="btn-group">
          <Link to="/admin/users" className="btn btn-secondary">
            View & Manage Users
          </Link>
          <Link to="/admin/stores" className="btn btn-secondary">
            View & Manage Stores List
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;

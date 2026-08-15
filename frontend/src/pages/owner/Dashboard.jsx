import { useState, useEffect } from 'react';
import api from '../../api/axios';

function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    try {
      const res = await api.get('/dashboard/owner');
      setDashboard(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    }
    setLoading(false);
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading store statistics...</div>
      </div>
    );
  }

  if (!dashboard || !dashboard.storeName) {
    return (
      <div className="container">
        <div className="page-header">
          <div>
            <h1 className="page-title">Store Owner Dashboard</h1>
            <p className="page-subtitle">Manage and track customer feedback for your store</p>
          </div>
        </div>
        <div className="card">
          <p style={{ color: 'var(--text-muted)' }}>
            No store has been assigned to your owner account yet. Please contact the platform administrator to link your store.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Store Owner Dashboard</h1>
          <p className="page-subtitle">Performance overview for {dashboard.storeName}</p>
        </div>
      </div>

      <div className="dashboard-cards">
        <div className="stat-card stat-stores">
          <div>
            <div className="stat-label">Store Profile</div>
            <div className="stat-value" style={{ fontSize: '22px' }}>{dashboard.storeName}</div>
          </div>
          <div className="stat-subtext">Active store account</div>
        </div>

        <div className="stat-card stat-ratings">
          <div>
            <div className="stat-label">Average Rating</div>
            <div className="stat-value" style={{ color: '#d97706' }}>
              ★ {dashboard.averageRating.toFixed(1)} <span style={{ fontSize: '18px', color: 'var(--text-muted)' }}>/ 5</span>
            </div>
          </div>
          <div className="stat-subtext">Calculated across all customer reviews</div>
        </div>

        <div className="stat-card stat-users">
          <div>
            <div className="stat-label">Total Reviews Received</div>
            <div className="stat-value">{dashboard.raters.length}</div>
          </div>
          <div className="stat-subtext">Unique users who rated your store</div>
        </div>
      </div>

      <div className="page-header" style={{ marginBottom: '12px' }}>
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', color: 'var(--text-main)' }}>
            Customer Rating History
          </h2>
          <p style={{ fontSize: '13px', color: 'var(--text-muted)' }}>
            List of registered users who have submitted ratings for your store
          </p>
        </div>
      </div>

      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Customer Name</th>
                <th>Customer Email</th>
                <th>Submitted Rating</th>
                <th style={{ textAlign: 'right' }}>Review Date</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.raters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    No customer ratings submitted for your store yet.
                  </td>
                </tr>
              ) : (
                dashboard.raters.map((rater, index) => (
                  <tr key={index}>
                    <td style={{ fontWeight: '600' }}>{rater.name}</td>
                    <td>{rater.email}</td>
                    <td>
                      <span className="rating-badge">
                        <span className="rating-badge-star">★</span>
                        {rater.rating} / 5
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--text-muted)' }}>
                      {new Date(rater.created_at).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;

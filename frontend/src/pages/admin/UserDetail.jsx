import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/axios';

function UserDetail() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUser();
  }, [id]);

  async function fetchUser() {
    try {
      const res = await api.get(`/users/${id}`);
      setUser(res.data);
    } catch (err) {
      setError('Failed to load user details');
    }
    setLoading(false);
  }

  function renderRole(role) {
    if (role === 'ADMIN') return <span className="user-role-text user-role-admin">Admin</span>;
    if (role === 'OWNER') return <span className="user-role-text user-role-owner">Store Owner</span>;
    return <span className="user-role-text user-role-user">User</span>;
  }

  if (loading) {
    return (
      <div className="container">
        <div className="loading-state">Loading user profile...</div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="container">
        <div className="error-msg">{error || 'User not found'}</div>
        <Link to="/admin/users" className="btn btn-outline">Back to Users</Link>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">User Details</h1>
          <p className="page-subtitle">Detailed profile information for account ID #{user.id}</p>
        </div>
        <Link to="/admin/users" className="btn btn-outline">Back to Users</Link>
      </div>

      <div className="detail-card">
        <div className="detail-row">
          <div className="detail-label">Full Name</div>
          <div className="detail-value" style={{ fontWeight: '600' }}>{user.name}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Email Address</div>
          <div className="detail-value">{user.email}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Address</div>
          <div className="detail-value">{user.address}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Assigned Role</div>
          <div className="detail-value">{renderRole(user.role)}</div>
        </div>
        <div className="detail-row">
          <div className="detail-label">Registered Date</div>
          <div className="detail-value">
            {user.created_at ? new Date(user.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
          </div>
        </div>

        {user.role === 'OWNER' && (
          <>
            <div className="detail-row" style={{ backgroundColor: 'var(--bg-surface-subtle)' }}>
              <div className="detail-label" style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                Store Assignment
              </div>
              <div className="detail-value" style={{ fontWeight: '600' }}>
                {user.store ? user.store.name : 'No store assigned yet'}
              </div>
            </div>
            {user.store && (
              <>
                <div className="detail-row">
                  <div className="detail-label">Store Email</div>
                  <div className="detail-value">{user.store.email}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Store Address</div>
                  <div className="detail-value">{user.store.address}</div>
                </div>
                <div className="detail-row">
                  <div className="detail-label">Overall Store Rating</div>
                  <div className="detail-value">
                    <span className="rating-badge">
                      <span className="rating-badge-star">★</span>
                      {Number(user.store.averageRating).toFixed(1)} / 5
                    </span>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default UserDetail;

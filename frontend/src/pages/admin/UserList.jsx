import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '', role: '' });
  const [sortBy, setSortBy] = useState('created_at');
  const [order, setOrder] = useState('desc');

  useEffect(() => {
    fetchUsers();
  }, [filters, sortBy, order]);

  async function fetchUsers() {
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await api.get('/users', { params });
      setUsers(res.data);
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
    setLoading(false);
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilters({ name: '', email: '', address: '', role: '' });
  }

  function handleSort(field) {
    if (sortBy === field) {
      setOrder(order === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setOrder('asc');
    }
  }

  function getSortIndicator(field) {
    if (sortBy !== field) return null;
    return <span className="sort-indicator">{order === 'asc' ? ' ▲' : ' ▼'}</span>;
  }

  function renderRole(role) {
    if (role === 'ADMIN') return <span className="user-role-text user-role-admin">Admin</span>;
    if (role === 'OWNER') return <span className="user-role-text user-role-owner">Store Owner</span>;
    return <span className="user-role-text user-role-user">User</span>;
  }

  const hasActiveFilters = filters.name || filters.email || filters.address || filters.role;

  const totalCount = users.length;
  const adminCount = users.filter(u => u.role === 'ADMIN').length;
  const ownerCount = users.filter(u => u.role === 'OWNER').length;
  const userCount = users.filter(u => u.role === 'USER').length;

  return (
    <div className="container">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Users</h1>
          <p className="page-subtitle">Manage, search, filter, and inspect registered platform accounts</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">
          + Add New User
        </Link>
      </div>

      {/* Quick Summary Bar */}
      <div className="users-stats-bar">
        <div className="stat-pill stat-pill-total">
          <span className="stat-pill-label">Total Users</span>
          <span className="stat-pill-val">{loading ? '...' : totalCount}</span>
        </div>
        <div className="stat-pill stat-pill-admin">
          <span className="stat-pill-label">Admins</span>
          <span className="stat-pill-val">{loading ? '...' : adminCount}</span>
        </div>
        <div className="stat-pill stat-pill-owner">
          <span className="stat-pill-label">Store Owners</span>
          <span className="stat-pill-val">{loading ? '...' : ownerCount}</span>
        </div>
        <div className="stat-pill stat-pill-user">
          <span className="stat-pill-label">Normal Users</span>
          <span className="stat-pill-val">{loading ? '...' : userCount}</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="filters-card">
        <div className="filters-header">
          <span className="filters-title">Search & Filter Users</span>
          {hasActiveFilters && (
            <button type="button" className="btn-clear-filters" onClick={clearFilters}>
              Reset Filters ✕
            </button>
          )}
        </div>
        <div className="filters-grid">
          <input
            name="name"
            placeholder="Search by name..."
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            name="email"
            placeholder="Search by email..."
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            name="address"
            placeholder="Search by address..."
            value={filters.address}
            onChange={handleFilterChange}
          />
          <select name="role" value={filters.role} onChange={handleFilterChange}>
            <option value="">All Roles</option>
            <option value="ADMIN">System Administrator</option>
            <option value="USER">Normal User</option>
            <option value="OWNER">Store Owner</option>
          </select>
        </div>
      </div>

      {/* Users Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th className={`sortable ${sortBy === 'name' ? 'active-sort' : ''}`} onClick={() => handleSort('name')}>
                  User Name{getSortIndicator('name')}
                </th>
                <th className={`sortable ${sortBy === 'email' ? 'active-sort' : ''}`} onClick={() => handleSort('email')}>
                  Email Address{getSortIndicator('email')}
                </th>
                <th className={`sortable ${sortBy === 'address' ? 'active-sort' : ''}`} onClick={() => handleSort('address')}>
                  Address{getSortIndicator('address')}
                </th>
                <th className={`sortable ${sortBy === 'role' ? 'active-sort' : ''}`} onClick={() => handleSort('role')}>
                  Role{getSortIndicator('role')}
                </th>
                <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    Loading users list...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>👤</div>
                    No users found matching your search criteria
                    {hasActiveFilters && (
                      <div style={{ marginTop: '10px' }}>
                        <button type="button" className="btn btn-secondary btn-small" onClick={clearFilters}>
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id} className="user-table-row">
                    <td>
                      <span className="user-display-name">{user.name}</span>
                    </td>
                    <td>
                      <span className="user-email-text">{user.email}</span>
                    </td>
                    <td>
                      <span className="user-address-text" title={user.address}>
                        {user.address || 'N/A'}
                      </span>
                    </td>
                    <td>{renderRole(user.role)}</td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Link to={`/admin/users/${user.id}`} className="btn btn-secondary btn-small action-btn">
                        View Details →
                      </Link>
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

export default UserList;


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

  function renderRoleBadge(role) {
    if (role === 'ADMIN') return <span className="badge badge-admin">Admin</span>;
    if (role === 'OWNER') return <span className="badge badge-owner">Store Owner</span>;
    return <span className="badge badge-user">Normal User</span>;
  }

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Users Directory</h1>
          <p className="page-subtitle">Filter, search, sort, and view platform users</p>
        </div>
        <Link to="/admin/users/new" className="btn btn-primary">Add New User</Link>
      </div>

      <div className="filters-card">
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

      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Name{getSortIndicator('name')}
                </th>
                <th className="sortable" onClick={() => handleSort('email')}>
                  Email{getSortIndicator('email')}
                </th>
                <th className="sortable" onClick={() => handleSort('address')}>
                  Address{getSortIndicator('address')}
                </th>
                <th className="sortable" onClick={() => handleSort('role')}>
                  Role{getSortIndicator('role')}
                </th>
                <th style={{ textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No users matching the filters found</td>
                </tr>
              ) : (
                users.map(user => (
                  <tr key={user.id}>
                    <td style={{ fontWeight: '600' }}>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.address}</td>
                    <td>{renderRoleBadge(user.role)}</td>
                    <td style={{ textAlign: 'right' }}>
                      <Link to={`/admin/users/${user.id}`} className="btn btn-secondary btn-small">
                        View Details
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

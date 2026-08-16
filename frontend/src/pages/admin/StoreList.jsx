import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/axios';

function StoreListAdmin() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ name: '', email: '', address: '' });
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');

  useEffect(() => {
    fetchStores();
  }, [filters, sortBy, order]);

  async function fetchStores() {
    try {
      const params = { ...filters, sortBy, order };
      Object.keys(params).forEach(key => {
        if (!params[key]) delete params[key];
      });
      const res = await api.get('/stores/admin', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
    setLoading(false);
  }

  function handleFilterChange(e) {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  }

  function clearFilters() {
    setFilters({ name: '', email: '', address: '' });
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

  const hasActiveFilters = filters.name || filters.email || filters.address;

  const totalStores = stores.length;
  const topRatedCount = stores.filter(s => s.rating >= 4.0).length;
  const avgPlatformRating = totalStores > 0 
    ? (stores.reduce((acc, curr) => acc + curr.rating, 0) / totalStores).toFixed(1) 
    : '0.0';

  return (
    <div className="container">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Stores</h1>
          <p className="page-subtitle">Search, filter, and inspect registered stores and their average ratings</p>
        </div>
        <Link to="/admin/stores/new" className="btn btn-success">
          + Add New Store
        </Link>
      </div>

      {/* Quick Summary Bar */}
      <div className="users-stats-bar">
        <div className="stat-pill stat-pill-total">
          <span className="stat-pill-label">Total Stores</span>
          <span className="stat-pill-val">{loading ? '...' : totalStores}</span>
        </div>
        <div className="stat-pill stat-pill-owner">
          <span className="stat-pill-label">Top Rated (≥4★)</span>
          <span className="stat-pill-val">{loading ? '...' : topRatedCount}</span>
        </div>
        <div className="stat-pill stat-pill-admin">
          <span className="stat-pill-label">Avg Platform Rating</span>
          <span className="stat-pill-val">{loading ? '...' : `★ ${avgPlatformRating}`}</span>
        </div>
      </div>

      {/* Filters Toolbar */}
      <div className="filters-card">
        <div className="filters-header">
          <span className="filters-title">Search & Filter Stores</span>
          {hasActiveFilters && (
            <button type="button" className="btn-clear-filters" onClick={clearFilters}>
              Reset Filters ✕
            </button>
          )}
        </div>
        <div className="filters-grid">
          <input
            name="name"
            placeholder="Filter by store name..."
            value={filters.name}
            onChange={handleFilterChange}
          />
          <input
            name="email"
            placeholder="Filter by store email..."
            value={filters.email}
            onChange={handleFilterChange}
          />
          <input
            name="address"
            placeholder="Filter by store address..."
            value={filters.address}
            onChange={handleFilterChange}
          />
        </div>
      </div>

      {/* Stores Table */}
      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th className={`sortable ${sortBy === 'name' ? 'active-sort' : ''}`} onClick={() => handleSort('name')}>
                  Store Name{getSortIndicator('name')}
                </th>
                <th className={`sortable ${sortBy === 'email' ? 'active-sort' : ''}`} onClick={() => handleSort('email')}>
                  Email Address{getSortIndicator('email')}
                </th>
                <th className={`sortable ${sortBy === 'address' ? 'active-sort' : ''}`} onClick={() => handleSort('address')}>
                  Address{getSortIndicator('address')}
                </th>
                <th className={`sortable ${sortBy === 'rating' ? 'active-sort' : ''}`} onClick={() => handleSort('rating')}>
                  Average Rating{getSortIndicator('rating')}
                </th>
                <th style={{ textAlign: 'right', whiteSpace: 'nowrap', width: '140px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">Loading stores list...</td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">
                    <div style={{ fontSize: '24px', marginBottom: '8px' }}>🏪</div>
                    No stores matching your search criteria found
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
                stores.map(store => (
                  <tr key={store.id} className="user-table-row">
                    <td style={{ fontWeight: '700', color: 'var(--text-main)' }}>
                      {store.name}
                    </td>
                    <td>
                      <span className="user-email-text">{store.email}</span>
                    </td>
                    <td>
                      <span className="user-address-text" title={store.address}>
                        {store.address || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className="rating-badge">
                        <span className="rating-badge-star">★</span>
                        {store.rating.toFixed(1)} / 5
                      </span>
                    </td>
                    <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}>
                      <Link 
                        to={store.owner_id ? `/admin/users/${store.owner_id}` : '/admin/users'} 
                        className="btn btn-secondary btn-small action-btn"
                      >
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

export default StoreListAdmin;


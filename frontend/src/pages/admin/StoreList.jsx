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

  return (
    <div className="container">
      <div className="page-header">
        <div>
          <h1 className="page-title">Stores Directory</h1>
          <p className="page-subtitle">Search, filter, and inspect registered stores and their average ratings</p>
        </div>
        <Link to="/admin/stores/new" className="btn btn-success">Add New Store</Link>
      </div>

      <div className="filters-card">
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

      <div className="table-container">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort('name')}>
                  Store Name{getSortIndicator('name')}
                </th>
                <th className="sortable" onClick={() => handleSort('email')}>
                  Email{getSortIndicator('email')}
                </th>
                <th className="sortable" onClick={() => handleSort('address')}>
                  Address{getSortIndicator('address')}
                </th>
                <th className="sortable" onClick={() => handleSort('rating')}>
                  Average Rating{getSortIndicator('rating')}
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="4" className="empty-state">Loading stores...</td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">No stores matching the criteria found</td>
                </tr>
              ) : (
                stores.map(store => (
                  <tr key={store.id}>
                    <td style={{ fontWeight: '600' }}>{store.name}</td>
                    <td>{store.email}</td>
                    <td>{store.address}</td>
                    <td>
                      <span className="rating-badge">
                        <span className="rating-badge-star">★</span>
                        {store.rating.toFixed(1)} / 5
                      </span>
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

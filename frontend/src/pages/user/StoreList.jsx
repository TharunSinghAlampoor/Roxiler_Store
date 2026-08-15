import { useState, useEffect } from 'react';
import api from '../../api/axios';
import StarRating from '../../components/StarRating';

function UserStoreList() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  useEffect(() => {
    fetchStores();
  }, [searchName, searchAddress, sortBy, order]);

  async function fetchStores() {
    try {
      const params = { sortBy, order };
      if (searchName) params.name = searchName;
      if (searchAddress) params.address = searchAddress;
      const res = await api.get('/stores', { params });
      setStores(res.data);
    } catch (err) {
      console.error('Failed to fetch stores:', err);
    }
    setLoading(false);
  }

  function showMessage(text, type) {
    setMessage(text);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3500);
  }

  async function handleRatingSubmit(storeId, rating) {
    try {
      await api.post('/ratings', { storeId, rating });
      showMessage('Your rating has been submitted successfully!', 'success');
      fetchStores();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to submit rating', 'error');
    }
  }

  async function handleRatingModify(ratingId, rating) {
    try {
      await api.put(`/ratings/${ratingId}`, { rating });
      showMessage('Your rating has been updated successfully!', 'success');
      fetchStores();
    } catch (err) {
      showMessage(err.response?.data?.message || 'Failed to update rating', 'error');
    }
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
          <h1 className="page-title">Explore Stores</h1>
          <p className="page-subtitle">Search registered stores, view ratings, and submit your review (1 to 5 stars)</p>
        </div>
      </div>

      {message && (
        <div className={messageType === 'success' ? 'success-msg' : 'error-msg'}>
          {message}
        </div>
      )}

      <div className="filters-card">
        <div className="filters-grid">
          <input
            placeholder="Search stores by name..."
            value={searchName}
            onChange={(e) => setSearchName(e.target.value)}
          />
          <input
            placeholder="Search stores by address / city..."
            value={searchAddress}
            onChange={(e) => setSearchAddress(e.target.value)}
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
                <th className="sortable" onClick={() => handleSort('address')}>
                  Address{getSortIndicator('address')}
                </th>
                <th className="sortable" onClick={() => handleSort('rating')}>
                  Overall Rating{getSortIndicator('rating')}
                </th>
                <th>Your Submitted Rating</th>
                <th style={{ minWidth: '220px' }}>Rate / Modify</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="empty-state">Loading store listings...</td>
                </tr>
              ) : stores.length === 0 ? (
                <tr>
                  <td colSpan="5" className="empty-state">No stores found matching your search</td>
                </tr>
              ) : (
                stores.map(store => (
                  <StoreRow
                    key={store.id}
                    store={store}
                    onSubmit={handleRatingSubmit}
                    onModify={handleRatingModify}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function StoreRow({ store, onSubmit, onModify }) {
  const [selectedRating, setSelectedRating] = useState(store.userRating || 0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setSelectedRating(store.userRating || 0);
  }, [store.userRating]);

  async function handleActionClick() {
    if (selectedRating < 1 || selectedRating > 5) return;

    setSubmitting(true);
    try {
      if (store.userRatingId) {
        await onModify(store.userRatingId, selectedRating);
      } else {
        await onSubmit(store.id, selectedRating);
      }
    } finally {
      setSubmitting(false);
    }
  }

  const hasRated = !!store.userRating;

  return (
    <tr>
      <td style={{ fontWeight: '600' }}>{store.name}</td>
      <td>{store.address}</td>
      <td>
        <span className="rating-badge">
          <span className="rating-badge-star">★</span>
          {store.overallRating.toFixed(1)} / 5
        </span>
      </td>
      <td>
        {hasRated ? (
          <span className="rating-badge" style={{ backgroundColor: '#ecfdf5', color: '#065f46', borderColor: '#a7f3d0' }}>
            <span style={{ color: '#059669' }}>★</span>
            {store.userRating} / 5
          </span>
        ) : (
          <span style={{ color: 'var(--text-subtle)', fontSize: '12px' }}>Not rated yet</span>
        )}
      </td>
      <td>
        <div className="rate-action-group">
          <StarRating
            value={selectedRating}
            onChange={(val) => setSelectedRating(val)}
          />
          <button
            className={`btn btn-small ${hasRated ? 'btn-secondary' : 'btn-primary'}`}
            onClick={handleActionClick}
            disabled={submitting || selectedRating === 0}
          >
            {submitting ? 'Saving...' : hasRated ? 'Modify' : 'Submit'}
          </button>
        </div>
      </td>
    </tr>
  );
}

export default UserStoreList;

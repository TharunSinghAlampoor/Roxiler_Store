import { useState, useEffect, useMemo } from 'react';
import api from '../../api/axios';

function OwnerDashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  useEffect(() => {
    fetchDashboard();
  }, []);

  async function fetchDashboard() {
    setLoading(true);
    try {
      const res = await api.get('/dashboard/owner');
      setDashboard(res.data);
    } catch (err) {
      console.error('Failed to load dashboard:', err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate Star Rating Breakdown Distribution
  const ratingBreakdown = useMemo(() => {
    if (!dashboard || !dashboard.raters) return { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    dashboard.raters.forEach(r => {
      const rounded = Math.round(Number(r.rating));
      if (counts[rounded] !== undefined) {
        counts[rounded] += 1;
      }
    });
    return counts;
  }, [dashboard]);

  // Filter and Sort Customer Ratings
  const filteredRaters = useMemo(() => {
    if (!dashboard || !dashboard.raters) return [];
    
    let result = dashboard.raters.filter(r => {
      const name = (r.name || '').toLowerCase();
      const email = (r.email || '').toLowerCase();
      const term = searchTerm.toLowerCase();
      return name.includes(term) || email.includes(term);
    });

    result.sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
      if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
      if (sortBy === 'highest') return Number(b.rating) - Number(a.rating);
      if (sortBy === 'lowest') return Number(a.rating) - Number(b.rating);
      return 0;
    });

    return result;
  }, [dashboard, searchTerm, sortBy]);

  function getRatingSentiment(rating) {
    const val = Number(rating);
    if (val >= 4.5) return { text: 'Excellent', bg: '#FEF3C7', color: '#B45309' };
    if (val >= 3.5) return { text: 'Very Good', bg: '#FEF3C7', color: '#B45309' };
    if (val >= 2.8) return { text: 'Good', bg: '#FEF3C7', color: '#B45309' };
    if (val >= 2.0) return { text: 'Fair', bg: '#FFF3EB', color: '#E05A36' };
    return { text: 'Needs Attention', bg: '#FEF2F2', color: '#DC2626' };
  }

  function getInitials(name) {
    if (!name) return 'U';
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  }

  if (loading) {
    return (
      <div className="container" style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div className="loading-state" style={{ fontSize: '16px', fontWeight: '700', color: 'var(--text-muted)' }}>
          Loading store owner performance analytics...
        </div>
      </div>
    );
  }

  if (!dashboard || !dashboard.storeName) {
    return (
      <div className="container" style={{ padding: '30px 20px' }}>
        <div className="page-header mb-20">
          <div>
            <h1 className="page-title">Store Owner Dashboard</h1>
            <p className="page-subtitle">Manage and track customer feedback for your store</p>
          </div>
        </div>
        <div className="card" style={{ padding: '30px', textAlign: 'center', background: '#FFFFFF', borderRadius: '14px', border: '1px solid #E5E0D8' }}>
          <div style={{ fontSize: '36px', marginBottom: '12px' }}>🏪</div>
          <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E2022', marginBottom: '8px' }}>
            No Store Assigned
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '14px', maxWidth: '480px', margin: '0 auto' }}>
            No store listing has been linked to your owner account yet. Please contact the platform administrator to associate your store.
          </p>
        </div>
      </div>
    );
  }

  const totalReviews = dashboard.raters.length;

  return (
    <div className="container" style={{ maxWidth: '1240px', padding: '30px 20px' }}>
      {/* Header Banner */}
      <div className="page-header mb-20" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span style={{ fontSize: '12px', fontWeight: '800', backgroundColor: '#FEF3C7', color: '#B45309', border: '1px solid #F59E0B', padding: '2px 10px', borderRadius: '999px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Store Owner Analytics
            </span>
          </div>
          <h1 className="page-title" style={{ fontSize: '28px', fontWeight: '900', color: '#1E2022' }}>
            {dashboard.storeName}
          </h1>
          <p className="page-subtitle" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
            Live performance overview, rating distribution, and customer reviews
          </p>
        </div>

        <button 
          type="button" 
          className="btn btn-secondary" 
          onClick={fetchDashboard}
          style={{ height: '38px', padding: '0 16px', fontSize: '13px', fontWeight: '700' }}
        >
          🔄 Refresh Analytics
        </button>
      </div>

      {/* Top Metric Cards (3 Columns) */}
      <div className="dashboard-cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
        {/* Card 1: Store Profile */}
        <div className="stat-card" style={{ background: '#FFFFFF', padding: '22px', borderRadius: '14px', border: '1px solid #E5E0D8', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #4F46E5 0%, #7C3AED 100%)' }} />
          <div className="stat-label" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '8px' }}>
            STORE PROFILE
          </div>
          <div className="stat-value" style={{ fontSize: '22px', fontWeight: '900', color: '#1E2022', marginBottom: '6px' }}>
            {dashboard.storeName}
          </div>
          <div className="stat-subtext" style={{ fontSize: '13px', fontWeight: '600', color: '#047857', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#10B981', display: 'inline-block' }} />
            Active store listing
          </div>
        </div>

        {/* Card 2: Average Rating */}
        <div className="stat-card" style={{ background: '#FFFFFF', padding: '22px', borderRadius: '14px', border: '1px solid #E5E0D8', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #F59E0B 0%, #D97706 100%)' }} />
          <div className="stat-label" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '8px' }}>
            AVERAGE SCORE
          </div>
          <div className="stat-value" style={{ fontSize: '32px', fontWeight: '900', color: '#D97706', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#F59E0B' }}>★</span>
            {dashboard.averageRating.toFixed(1)}
            <span style={{ fontSize: '18px', color: 'var(--text-muted)', fontWeight: '600' }}>/ 5</span>
          </div>
          <div className="stat-subtext" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>
            Across {totalReviews} customer {totalReviews === 1 ? 'review' : 'reviews'}
          </div>
        </div>

        {/* Card 3: Total Reviews */}
        <div className="stat-card" style={{ background: '#FFFFFF', padding: '22px', borderRadius: '14px', border: '1px solid #E5E0D8', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '4px', background: 'linear-gradient(90deg, #E05A36 0%, #C54927 100%)' }} />
          <div className="stat-label" style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.06em', marginBottom: '8px' }}>
            TOTAL REVIEWS
          </div>
          <div className="stat-value" style={{ fontSize: '32px', fontWeight: '900', color: '#1E2022' }}>
            {totalReviews}
          </div>
          <div className="stat-subtext" style={{ fontSize: '13px', fontWeight: '600', color: 'var(--text-muted)', marginTop: '4px' }}>
            Unique users who rated your store
          </div>
        </div>
      </div>

      {/* Customer Rating History Table Section */}
      <div className="card" style={{ background: '#FFFFFF', padding: '24px', borderRadius: '14px', border: '1px solid #E5E0D8' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontSize: '18px', fontWeight: '800', color: '#1E2022', margin: 0 }}>
              Customer Rating History
            </h3>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', marginTop: '2px', margin: 0 }}>
              Detailed feedback and ratings submitted by registered users
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', width: '100%', maxWidth: '480px' }}>
            <input
              type="text"
              placeholder="Search by customer name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                flex: 1,
                height: '38px',
                padding: '0 14px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                outline: 'none'
              }}
            />

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              style={{
                height: '38px',
                padding: '0 12px',
                borderRadius: '8px',
                border: '1px solid #CBD5E1',
                fontSize: '13px',
                background: '#FFFFFF',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest">Sort: Highest Rating</option>
              <option value="lowest">Sort: Lowest Rating</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="data-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#FAF9F6', borderBottom: '1.5px solid #E5E0D8', textAlign: 'left' }}>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Customer
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Submitted Rating
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Sentiment
                </th>
                <th style={{ padding: '12px 16px', fontSize: '12px', fontWeight: '800', color: 'var(--text-muted)', textTransform: 'uppercase', textAlign: 'right' }}>
                  Review Date
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredRaters.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state" style={{ padding: '36px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '14px' }}>
                    {searchTerm ? 'No customer reviews match your search query.' : 'No customer ratings submitted for your store yet.'}
                  </td>
                </tr>
              ) : (
                filteredRaters.map((rater, index) => {
                  const sentiment = getRatingSentiment(rater.rating);
                  return (
                    <tr key={index} style={{ borderBottom: '1px solid #F1F5F9', transition: 'background-color 0.15s ease' }}>
                      <td style={{ padding: '14px 16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #FFF3EB 0%, #FDE68A 100%)',
                            border: '1px solid #FCD3C1',
                            color: '#E05A36',
                            fontWeight: '800',
                            fontSize: '13px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                          }}>
                            {getInitials(rater.name)}
                          </div>
                          <div>
                            <div style={{ fontWeight: '800', fontSize: '14px', color: '#1E2022' }}>
                              {rater.name}
                            </div>
                            <div style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '2px' }}>
                              {rater.email}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span className="rating-badge" style={{
                          backgroundColor: '#FEF3C7',
                          color: '#B45309',
                          border: '1px solid #F59E0B',
                          fontWeight: '800',
                          fontSize: '13px',
                          padding: '4px 12px',
                          borderRadius: '999px',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}>
                          <span style={{ color: '#F59E0B' }}>★</span>
                          {rater.rating} / 5
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px' }}>
                        <span style={{
                          backgroundColor: sentiment.bg,
                          color: sentiment.color,
                          padding: '3px 10px',
                          borderRadius: '6px',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}>
                          {sentiment.text}
                        </span>
                      </td>

                      <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-muted)', fontSize: '13px', fontWeight: '600' }}>
                        {new Date(rater.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default OwnerDashboard;

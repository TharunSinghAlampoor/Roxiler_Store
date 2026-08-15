import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

function Profile() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(user);

  const [showResetModal, setShowResetModal] = useState(false);

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Fetch full fresh user details on mount (including address)
  useEffect(() => {
    async function fetchMe() {
      try {
        const res = await api.get('/auth/me');
        if (res.data) {
          setProfileData(res.data);
          localStorage.setItem('user', JSON.stringify(res.data));
        }
      } catch (err) {
        console.error('Failed to fetch user profile details:', err);
      }
    }
    fetchMe();
  }, []);

  function validatePassword(pwd) {
    if (pwd.length < 8 || pwd.length > 16) {
      return 'New password must be between 8 and 16 characters';
    }
    if (!/[A-Z]/.test(pwd)) {
      return 'New password must contain at least one uppercase letter (A-Z)';
    }
    if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(pwd)) {
      return 'New password must contain at least one special character (!@#$...)';
    }
    return null;
  }

  async function handlePasswordSubmit(e) {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword) {
      setError('Please enter your current password');
      return;
    }

    const pwdError = validatePassword(newPassword);
    if (pwdError) {
      setError(pwdError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.put('/auth/password', { currentPassword, newPassword });
      setSuccess(res.data.message || 'Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setShowResetModal(false);
        setSuccess('');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to update password. Verify current password.');
    } finally {
      setSubmitting(false);
    }
  }

  const currentUser = profileData || user;
  if (!currentUser) return null;

  return (
    <div className="container" style={{ maxWidth: '640px', padding: '40px 20px' }}>
      <div className="page-header mb-20" style={{ textAlign: 'center' }}>
        <h1 className="page-title">User Profile</h1>
        <p className="page-subtitle">Manage your personal account details and security settings</p>
      </div>

      {/* User Details Card */}
      <div className="card" style={{ padding: '28px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E0D8' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '800', marginBottom: '20px', color: 'var(--text-main)', borderBottom: '1px solid #F1F5F9', paddingBottom: '12px' }}>
          Account Information
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginBottom: '28px' }}>
          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Full Name
            </div>
            <div style={{ fontSize: '17px', fontWeight: '800', color: 'var(--text-main)', marginTop: '4px' }}>
              {currentUser.name}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Email Address
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
              {currentUser.email}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Role
            </div>
            <div style={{ fontSize: '15px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px' }}>
              {currentUser.role === 'ADMIN' ? 'Admin' : currentUser.role === 'OWNER' ? 'Store Owner' : 'Normal User'}
            </div>
          </div>

          <div>
            <div style={{ fontSize: '11px', fontWeight: '800', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em' }}>
              Address
            </div>
            <div style={{ fontSize: '14px', fontWeight: '600', color: 'var(--text-main)', marginTop: '4px', lineHeight: '1.5' }}>
              {currentUser.address || 'No address specified'}
            </div>
          </div>
        </div>

        {/* Action Button: Reset Password */}
        <button 
          type="button" 
          className="btn btn-primary btn-full"
          onClick={() => {
            setError('');
            setSuccess('');
            setShowResetModal(true);
          }}
          style={{ 
            height: '44px',
            fontSize: '15px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #E05A36 0%, #C54927 100%)',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}
        >
          Reset Password
        </button>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-backdrop" style={{
          position: 'fixed',
          inset: 0,
          backgroundColor: 'rgba(15, 23, 42, 0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 200,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="modal-content" style={{
            background: '#FFFFFF',
            borderRadius: '16px',
            maxWidth: '460px',
            width: '100%',
            padding: '28px',
            boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
            border: '1px solid #E5E0D8'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '800', color: '#1E2022', margin: 0 }}>
                Reset Your Password
              </h3>
              <button 
                type="button" 
                onClick={() => setShowResetModal(false)}
                style={{ background: 'none', border: 'none', fontSize: '20px', cursor: 'pointer', color: '#64748B' }}
              >
                ✕
              </button>
            </div>

            {error && <div className="error-msg" style={{ marginBottom: '14px' }}>{error}</div>}
            {success && <div className="success-msg" style={{ marginBottom: '14px' }}>{success}</div>}

            <form onSubmit={handlePasswordSubmit}>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label htmlFor="currentPassword">Current Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="currentPassword"
                    type={showCurrent ? 'text' : 'password'}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowCurrent(!showCurrent)}
                    aria-label={showCurrent ? 'Hide password' : 'Show password'}
                  >
                    {showCurrent ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label htmlFor="newPassword">
                  New Password
                  <span className="label-hint">(8-16 chars, 1 uppercase, 1 special)</span>
                </label>
                <div className="password-input-wrapper">
                  <input
                    id="newPassword"
                    type={showNew ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowNew(!showNew)}
                    aria-label={showNew ? 'Hide password' : 'Show password'}
                  >
                    {showNew ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label htmlFor="confirmPassword">Confirm New Password</label>
                <div className="password-input-wrapper">
                  <input
                    id="confirmPassword"
                    type={showConfirm ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Re-enter new password"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirm(!showConfirm)}
                    aria-label={showConfirm ? 'Hide password' : 'Show password'}
                  >
                    {showConfirm ? '🙈' : '👁'}
                  </button>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowResetModal(false)}
                  style={{ flex: 1 }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submitting}
                  style={{ flex: 2 }}
                >
                  {submitting ? 'Updating...' : 'Update Password'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;

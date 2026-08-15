import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';

function Signup() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  function validate() {
    const newErrors = {};

    if (formData.name.trim().length < 20) {
      newErrors.name = 'Name must be at least 20 characters';
    } else if (formData.name.trim().length > 60) {
      newErrors.name = 'Name must not exceed 60 characters';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (formData.address.trim().length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter (A-Z)';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$...)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerError('');
    setSuccess('');

    if (!validate()) return;

    setSubmitting(true);
    try {
      await api.post('/auth/signup', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        password: formData.password
      });
      setSuccess('Account created successfully! Redirecting to login page...');
      setTimeout(() => navigate('/login'), 1800);
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(e => {
          backendErrors[e.path] = e.msg;
        });
        setErrors(backendErrors);
      } else {
        setServerError(err.response?.data?.message || 'Registration failed. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-brand-header">
        <div className="auth-brand-title">
          Roxiler
          <span className="auth-brand-tag">Rating Platform</span>
        </div>
        <p className="auth-brand-desc">Join to browse and rate registered stores</p>
      </div>

      <div className="form-container form-wide">
        <div className="form-header">
          <h2>Create User Account</h2>
          <p>Register as a Normal User to get started</p>
        </div>

        {serverError && <div className="error-msg">{serverError}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">
              Full Name
              <span className="label-hint">(20 to 60 characters)</span>
            </label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Alexander Jonathan Smith"
              className={errors.name ? 'has-error' : ''}
              required
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="alexander@example.com"
              className={errors.email ? 'has-error' : ''}
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Address
              <span className="label-hint">(max 400 characters)</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter your full residential address"
              className={errors.address ? 'has-error' : ''}
              required
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
              <span className="label-hint">(8-16 chars, 1 uppercase, 1 special char)</span>
            </label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="e.g. Secure@Pass123"
                className={errors.password ? 'has-error' : ''}
                autoComplete="new-password"
                required
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  /* Eye Off Icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
                    <line x1="1" y1="1" x2="23" y2="23"></line>
                  </svg>
                ) : (
                  /* Eye Icon */
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                )}
              </button>
            </div>
            {errors.password && <div className="field-error">{errors.password}</div>}
          </div>

          <button 
            type="submit" 
            className="btn btn-primary btn-full"
            disabled={submitting}
          >
            {submitting ? 'Creating Account...' : 'Sign Up as User'}
          </button>
        </form>

        <p className="text-center mt-20" style={{ fontSize: '14px', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" className="link">Sign In</Link>
        </p>
      </div>
    </div>
  );
}

export default Signup;

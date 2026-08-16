import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

function AddUser() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    address: '',
    role: 'USER'
  });
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

    if (formData.password.length < 8 || formData.password.length > 16) {
      newErrors.password = 'Password must be between 8 and 16 characters';
    } else if (!/[A-Z]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter (A-Z)';
    } else if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one special character (!@#$...)';
    }

    if (formData.address.trim().length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
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
      await api.post('/users', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        password: formData.password,
        address: formData.address.trim(),
        role: formData.role
      });
      setSuccess('User created successfully! Redirecting to Users...');
      setTimeout(() => navigate('/admin/users'), 1500);
    } catch (err) {
      if (err.response?.data?.errors) {
        const backendErrors = {};
        err.response.data.errors.forEach(e => {
          backendErrors[e.path] = e.msg;
        });
        setErrors(backendErrors);
      } else {
        setServerError(err.response?.data?.message || 'Failed to create user');
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container form-wrapper">
      <div className="form-container form-wide">
        <div className="form-header">
          <h2>Add New User</h2>
          <p>Create a System Administrator, Normal User, or Store Owner</p>
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
              placeholder="e.g. Jonathan Edwards Retailer"
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
              placeholder="user@example.com"
              className={errors.email ? 'has-error' : ''}
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="role">User Role</label>
            <select id="role" name="role" value={formData.role} onChange={handleChange}>
              <option value="USER">Normal User</option>
              <option value="ADMIN">System Administrator</option>
              <option value="OWNER">Store Owner</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="password">
              Password
              <span className="label-hint">(8-16 chars, 1 uppercase, 1 special char)</span>
            </label>
            <input
              id="password"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="e.g. Admin@1234"
              className={errors.password ? 'has-error' : ''}
              required
            />
            {errors.password && <div className="field-error">{errors.password}</div>}
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
              placeholder="Enter full address"
              className={errors.address ? 'has-error' : ''}
              required
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="btn-group mt-10">
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              {submitting ? 'Creating User...' : 'Create User'}
            </button>
            <Link to="/admin/users" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddUser;

import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../../api/axios';

function AddStore() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    ownerId: ''
  });
  const [owners, setOwners] = useState([]);
  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOwners();
  }, []);

  async function fetchOwners() {
    try {
      const res = await api.get('/users', { params: { role: 'OWNER' } });
      setOwners(res.data);
    } catch (err) {
      console.error('Failed to fetch owners:', err);
    }
  }

  function validate() {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Store name is required';
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(formData.email.trim())) {
      newErrors.email = 'Please enter a valid store email';
    }

    if (formData.address.trim().length > 400) {
      newErrors.address = 'Address must not exceed 400 characters';
    }

    if (!formData.ownerId) {
      newErrors.ownerId = 'Please select a Store Owner from the list';
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
      await api.post('/stores', {
        name: formData.name.trim(),
        email: formData.email.trim(),
        address: formData.address.trim(),
        ownerId: parseInt(formData.ownerId)
      });
      setSuccess('Store created successfully! Redirecting to stores list...');
      setTimeout(() => navigate('/admin/stores'), 1500);
    } catch (err) {
      setServerError(err.response?.data?.message || 'Failed to create store');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container form-wrapper">
      <div className="form-container form-wide">
        <div className="form-header">
          <h2>Add New Store</h2>
          <p>Register a store profile and link it to an existing Store Owner</p>
        </div>

        {serverError && <div className="error-msg">{serverError}</div>}
        {success && <div className="success-msg">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Store Name</label>
            <input
              id="name"
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Apex Electronics & Gadgets"
              className={errors.name ? 'has-error' : ''}
              required
            />
            {errors.name && <div className="field-error">{errors.name}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Store Email Address</label>
            <input
              id="email"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="contact@storename.com"
              className={errors.email ? 'has-error' : ''}
              required
            />
            {errors.email && <div className="field-error">{errors.email}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="address">
              Store Physical Address
              <span className="label-hint">(max 400 characters)</span>
            </label>
            <textarea
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              rows="3"
              placeholder="Enter full physical address and postal code"
              className={errors.address ? 'has-error' : ''}
              required
            />
            {errors.address && <div className="field-error">{errors.address}</div>}
          </div>

          <div className="form-group">
            <label htmlFor="ownerId">Assign Store Owner</label>
            <select
              id="ownerId"
              name="ownerId"
              value={formData.ownerId}
              onChange={handleChange}
              className={errors.ownerId ? 'has-error' : ''}
              required
            >
              <option value="">-- Choose an Owner Account --</option>
              {owners.map(owner => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} ({owner.email})
                </option>
              ))}
            </select>
            {errors.ownerId && <div className="field-error">{errors.ownerId}</div>}
            {owners.length === 0 && (
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginTop: '4px' }}>
                No Store Owner accounts found. You must create a user with the "Store Owner" role first.
              </p>
            )}
          </div>

          <div className="btn-group mt-10">
            <button 
              type="submit" 
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={submitting}
            >
              {submitting ? 'Creating Store...' : 'Create Store'}
            </button>
            <Link to="/admin/stores" className="btn btn-outline">
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddStore;

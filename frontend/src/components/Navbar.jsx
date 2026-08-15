import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  const roleClass = 
    user.role === 'ADMIN' ? 'badge-admin' :
    user.role === 'OWNER' ? 'badge-owner' : 'badge-user';

  const roleLabel = 
    user.role === 'ADMIN' ? 'Admin' :
    user.role === 'OWNER' ? 'Store Owner' : 'Normal User';

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="brand" onClick={() => setMobileMenuOpen(false)}>
          Roxiler
          <span className="brand-badge">Rating Platform</span>
        </Link>

        <button 
          className="navbar-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? 'Close Menu' : 'Menu'}
        </button>

        <div className={`nav-links ${mobileMenuOpen ? 'mobile-open' : ''}`}>
          {user.role === 'ADMIN' && (
            <>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Users
              </NavLink>
              <NavLink 
                to="/admin/stores" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Stores
              </NavLink>
            </>
          )}

          {user.role === 'USER' && (
            <>
              <NavLink 
                to="/stores" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Stores
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Change Password
              </NavLink>
            </>
          )}

          {user.role === 'OWNER' && (
            <>
              <NavLink 
                to="/owner" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => (isActive ? 'active' : '')}
                onClick={() => setMobileMenuOpen(false)}
              >
                Change Password
              </NavLink>
            </>
          )}

          <div className="user-info-pill">
            <span className="user-name">{user.name}</span>
            <span className={`badge ${roleClass}`}>{roleLabel}</span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

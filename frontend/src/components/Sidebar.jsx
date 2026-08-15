import { useState } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        className="sidebar-mobile-toggle" 
        onClick={() => setMobileOpen(!mobileOpen)}
        aria-label="Toggle navigation menu"
      >
        {mobileOpen ? 'Close' : 'Menu'}
      </button>

      {/* Sidebar Overlay for Mobile */}
      {mobileOpen && (
        <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
      )}

      {/* Left Sidebar Main Container */}
      <aside className={`sidebar ${collapsed ? 'is-collapsed' : ''} ${mobileOpen ? 'mobile-open' : ''}`}>
        {/* Brand Header with Collapse Toggle */}
        <div className="sidebar-header">
          <Link to="/" className="sidebar-brand" onClick={() => setMobileOpen(false)}>
            <div className="sidebar-logo-text">{collapsed ? 'R' : 'Roxiler'}</div>
          </Link>

          <button 
            type="button" 
            className="sidebar-collapse-btn"
            onClick={onToggle}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '»' : '«'}
          </button>
        </div>

        {/* Navigation Links Group */}
        <div className="sidebar-nav">
          {user.role === 'ADMIN' && (
            <>
              <NavLink 
                to="/admin" 
                end
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? 'Dashboard' : undefined}
              >
                <span className="nav-text">{collapsed ? 'DB' : 'Dashboard'}</span>
              </NavLink>
              <NavLink 
                to="/admin/users" 
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? 'Users Management' : undefined}
              >
                <span className="nav-text">{collapsed ? 'UM' : 'Users Management'}</span>
              </NavLink>
              <NavLink 
                to="/admin/stores" 
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? 'Stores Management' : undefined}
              >
                <span className="nav-text">{collapsed ? 'SM' : 'Stores Management'}</span>
              </NavLink>
            </>
          )}

          {user.role === 'USER' && (
            <>
              <NavLink 
                to="/stores" 
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? 'Stores' : undefined}
              >
                <span className="nav-text">{collapsed ? 'ST' : 'Stores'}</span>
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? 'Change Password' : undefined}
              >
                <span className="nav-text">{collapsed ? 'CP' : 'Change Password'}</span>
              </NavLink>
            </>
          )}

          {user.role === 'OWNER' && (
            <>
              <NavLink 
                to="/owner" 
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? 'Owner Dashboard' : undefined}
              >
                <span className="nav-text">{collapsed ? 'OD' : 'Owner Dashboard'}</span>
              </NavLink>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
                onClick={() => setMobileOpen(false)}
                title={collapsed ? 'Change Password' : undefined}
              >
                <span className="nav-text">{collapsed ? 'CP' : 'Change Password'}</span>
              </NavLink>
            </>
          )}
        </div>

        {/* User Profile & Logout Footer */}
        <div className="sidebar-footer">
          <div className="sidebar-user-card">
            <div className="sidebar-user-name">{collapsed ? user.name.charAt(0).toUpperCase() : user.name}</div>
          </div>

          <button className="sidebar-logout-btn" onClick={handleLogout} title={collapsed ? 'Logout' : undefined}>
            {collapsed ? '✕' : 'Logout'}
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;

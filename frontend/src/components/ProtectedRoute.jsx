import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // redirect to the right home page based on role
    if (user.role === 'ADMIN') return <Navigate to="/admin" />;
    if (user.role === 'OWNER') return <Navigate to="/owner" />;
    return <Navigate to="/stores" />;
  }

  return children;
}

export default ProtectedRoute;

import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Profile from './pages/Profile';
import AdminDashboard from './pages/admin/Dashboard';
import UserList from './pages/admin/UserList';
import UserDetail from './pages/admin/UserDetail';
import AddUser from './pages/admin/AddUser';
import StoreListAdmin from './pages/admin/StoreList';
import AddStore from './pages/admin/AddStore';
import UserStoreList from './pages/user/StoreList';
import OwnerDashboard from './pages/owner/Dashboard';

function App() {
  const { user } = useAuth();

  function getHomePath() {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/admin';
    if (user.role === 'OWNER') return '/owner';
    return '/stores';
  }

  return (
    <div>
      <Navbar />
      <Routes>
        {/* public routes */}
        <Route path="/login" element={user ? <Navigate to={getHomePath()} /> : <Login />} />
        <Route path="/signup" element={user ? <Navigate to={getHomePath()} /> : <Signup />} />

        {/* shared: profile & change password */}
        <Route path="/profile" element={
          <ProtectedRoute allowedRoles={['USER', 'OWNER', 'ADMIN']}>
            <Profile />
          </ProtectedRoute>
        } />

        {/* admin routes */}
        <Route path="/admin" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        } />
        <Route path="/admin/users" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserList />
          </ProtectedRoute>
        } />
        <Route path="/admin/users/new" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddUser />
          </ProtectedRoute>
        } />
        <Route path="/admin/users/:id" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <UserDetail />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <StoreListAdmin />
          </ProtectedRoute>
        } />
        <Route path="/admin/stores/new" element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AddStore />
          </ProtectedRoute>
        } />

        {/* normal user routes */}
        <Route path="/stores" element={
          <ProtectedRoute allowedRoles={['USER']}>
            <UserStoreList />
          </ProtectedRoute>
        } />

        {/* store owner routes */}
        <Route path="/owner" element={
          <ProtectedRoute allowedRoles={['OWNER']}>
            <OwnerDashboard />
          </ProtectedRoute>
        } />

        {/* catch all - redirect to home */}
        <Route path="*" element={<Navigate to={getHomePath()} />} />
      </Routes>
    </div>
  );
}

export default App;

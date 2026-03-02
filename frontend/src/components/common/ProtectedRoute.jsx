import { Navigate } from 'react-router-dom';
import { isAuthenticated, getUserRole } from '../../utils/auth';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  if (!isAuthenticated()) return <Navigate to="/login" replace />;
  if (allowedRoles.length && !allowedRoles.includes(getUserRole())) return <Navigate to="/unauthorized" replace />;
  return children;
};

export default ProtectedRoute;

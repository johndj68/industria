import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { SimuladorLoading } from '../../SimuladorComponentes';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, carregando } = useAuth();

  if (carregando) return <SimuladorLoading />;
  if (!user) return <Navigate to="/login" replace />;
  if (adminOnly && user.role !== 'ADMIN') return <Navigate to="/" replace />;

  return children;
}

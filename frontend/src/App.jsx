import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { hasPermission } from '@/lib/roles';
import Layout from '@/components/layout/Layout';
import Forbidden from '@/pages/Forbidden';
import NotFound from '@/pages/NotFound';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import Employees from '@/pages/Employees';
import Offices from '@/pages/Offices';
import Categories from '@/pages/Categories';
import ExpendableItems from '@/pages/ExpendableItems';
import ReturnReceipts from '@/pages/ReturnReceipts';
import BlockchainVerification from '@/pages/BlockchainVerification';
import BlockchainLogs from '@/pages/BlockchainLogs';
import Reports from '@/pages/Reports';
import Users from '@/pages/Users';
import Settings from '@/pages/Settings';

function ProtectedRoute({ permission, children }) {
  const { isAuthenticated, user, loading } = useAuth();
  const location = useLocation();

  if (loading) return null;
  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }
  if (permission && !hasPermission(user.role, permission)) {
    return <Forbidden />;
  }
  return children;
}

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route path="/" element={<Dashboard />} />
        <Route path="/employees" element={<ProtectedRoute permission="employees.manage"><Employees /></ProtectedRoute>} />
        <Route path="/offices" element={<ProtectedRoute permission="offices.manage"><Offices /></ProtectedRoute>} />
        <Route path="/categories" element={<ProtectedRoute permission="categories.manage"><Categories /></ProtectedRoute>} />
        <Route path="/items" element={<ProtectedRoute permission="items.manage"><ExpendableItems /></ProtectedRoute>} />
        <Route path="/receipts" element={<ProtectedRoute permission="receipts.view"><ReturnReceipts /></ProtectedRoute>} />
        <Route path="/verify" element={<ProtectedRoute permission="blockchain.verify"><BlockchainVerification /></ProtectedRoute>} />
        <Route path="/blockchain-logs" element={<ProtectedRoute permission="blockchain.view"><BlockchainLogs /></ProtectedRoute>} />
        <Route path="/reports" element={<ProtectedRoute permission="reports.view"><Reports /></ProtectedRoute>} />
        <Route path="/users" element={<ProtectedRoute permission="users.manage"><Users /></ProtectedRoute>} />
        <Route path="/settings" element={<ProtectedRoute permission="settings.manage"><Settings /></ProtectedRoute>} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

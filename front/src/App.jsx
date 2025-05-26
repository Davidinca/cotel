import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Usuarios from './pages/Usuarios';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardHome from './pages/DashboardHome';
import Roles from './pages/Roles'
import Permisos from './pages/Permisos'
import ChangePasswordPage from './pages/ChangePasswordPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/change-password" element={<ChangePasswordPage />} /> {/* 👈 Nueva ruta */}
        <Route path="/dashboard" element={<DashboardLayout />}>
          <Route index element={<DashboardHome />} />
          <Route path="usuarios" element={<Usuarios />} />
          <Route path="roles" element={<Roles />} />
          <Route path="permisos" element={<Permisos />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

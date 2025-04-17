import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginSignUp from './pages/LoginSignUp';
import MigrarUsuario from './pages/MigrarUsuario';
import Home from './pages/Dashboard.jsx';
import ChangePassword from './pages/ChangePassword'; // Asegúrate de crear este componente
import BuscarContrato from "./pages/BuscarContrato.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginSignUp />} />
                <Route path="/migrar" element={<MigrarUsuario />} />
                <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                <Route path="/change-password" element={<ChangePassword />} />
                <Route path="/buscar-contrato" element={<ProtectedRoute><BuscarContrato /></ProtectedRoute>} />
            </Routes>
        </Router>
    );
}

// Componente para proteger rutas que requieren contraseña cambiada
const ProtectedRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.password_changed ? children : <Navigate to="/change-password" replace />;
};

// Componente para redirigir si ya cambió la contraseña
const PasswordChangeRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem('user'));
    return user?.password_changed ? <Navigate to="/home" replace /> : children;
};

export default App;


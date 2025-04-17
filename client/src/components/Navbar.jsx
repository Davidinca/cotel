import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem('user'));

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        navigate('/');
    };

    const goToChangePassword = () => {
        navigate('/change-password');
    };

    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h3>{user?.nombres || 'Usuario'}</h3>
            </div>
            <div className="navbar-right">
                <button onClick={goToChangePassword} className="navbar-btn">
                    Cambiar Contraseña
                </button>
                <button onClick={handleLogout} className="navbar-btn logout">
                    Cerrar Sesión
                </button>
            </div>
        </nav>
    );
};

export default Navbar;

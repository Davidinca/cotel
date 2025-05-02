import React from 'react';
import Navbar from '../components/Navbar.jsx';
import './Dashboard.css';
import BuscarContrato from './BuscarContrato/BuscarContrato.jsx';

const Dashboard = () => {
    return (
        <div className="main-container">
            <Navbar />
            <div className="content-container">
                <BuscarContrato />
            </div>
        </div>
    );
};

export default Dashboard;
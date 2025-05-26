// src/layouts/DashboardLayout.jsx
import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 p-6 overflow-auto">
          <Outlet /> {/* Aquí se renderizan las subpáginas */}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;

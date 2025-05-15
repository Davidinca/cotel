import React from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <div className="flex flex-col flex-1">
        {/* Header */}
        <Header />

        {/* Content area */}
        <main className="flex-1 p-6 overflow-auto">
          <h1 className="text-2xl font-bold mb-4">Bienvenido al Dashboard</h1>
          <p className="text-gray-700">Aquí puedes gestionar usuarios, roles y permisos.</p>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

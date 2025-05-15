import React from 'react';

const Header = () => {
  return (
    <header className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-xl font-semibold text-gray-800">Panel de Administración</h1>
      <button
        onClick={() => {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }}
        className="text-sm text-white bg-red-500 px-4 py-2 rounded hover:bg-red-600"
      >
        Cerrar sesión
      </button>
    </header>
  );
};

export default Header;

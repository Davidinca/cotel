import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();

  // Obtener permisos del usuario
  const permisos = JSON.parse(localStorage.getItem('user_data'))?.permisos || [];

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user_data');
    navigate('/');
  };

  return (
    <div className="flex h-screen flex-col justify-between border-e border-gray-100 bg-white">
      <div className="px-4 py-6">
        <span className="grid h-10 w-32 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
          Logo
        </span>

        <ul className="mt-6 space-y-1">
          <li>
            <Link
              to="/dashboard"
              className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              Dashboard
            </Link>
          </li>

          {permisos.includes("Panel_Usuarios") && (
            <li>
              <Link
                to="/dashboard/usuarios"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Usuarios
              </Link>
            </li>
          )}

          {permisos.includes("Panel_Roles") && (
            <li>
              <Link
                to="/dashboard/roles"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Roles
              </Link>
            </li>
          )}

          {permisos.includes("Panel_Permiso") && (
            <li>
              <Link
                to="/dashboard/permisos"
                className="block rounded-lg px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                Permisos
              </Link>
            </li>
          )}

          <li>
            <button
              onClick={handleLogout}
              className="w-full text-left rounded-lg px-4 py-2 text-sm font-medium text-red-600 hover:bg-gray-100"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </div>

      <div className="sticky inset-x-0 bottom-0 border-t border-gray-100">
        <div className="flex items-center gap-2 bg-white p-4">
          <img
            alt="Avatar"
            src="https://images.unsplash.com/photo-1600486913747-55e5470d6f40?auto=format&fit=crop&w=80&q=80"
            className="size-10 rounded-full object-cover"
          />
          <div>
            <p className="text-xs">
              <strong className="block font-medium">Usuario</strong>
              <span> usuario@correo.com </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

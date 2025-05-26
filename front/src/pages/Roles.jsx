import React, { useState, useEffect } from "react";
import axios from "axios";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-gray-500 hover:text-gray-700 text-xl font-bold"
        >
          &times;
        </button>
        <div>{children}</div>
      </div>
    </div>
  );
};

const Roles = () => {
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({ nombre: "" });
  const [editingRole, setEditingRole] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const fetchRoles = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://127.0.0.1:8000/api/roles/roles/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRoles(response.data);
    } catch (error) {
      console.error("Error al obtener roles:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!editingRole) {
        await axios.post("http://127.0.0.1:8000/api/roles/roles/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.patch(`http://127.0.0.1:8000/api/roles/roles/${editingRole.id}/`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await fetchRoles();
      setFormData({ nombre: "" });
      setEditingRole(null);
      setShowCreate(false);
      setShowEdit(false);
    } catch (error) {
      console.error("Error en el envío del formulario:", error.response?.data || error.message);
    }
  };

  const handleEdit = (role) => {
    setEditingRole(role);
    setFormData({ nombre: role.nombre });
    setShowEdit(true);
  };

  const handleCancelEdit = () => {
    setEditingRole(null);
    setFormData({ nombre: "" });
    setShowEdit(false);
  };

  const handleToggleEstado = async (role) => {
    try {
      const token = localStorage.getItem("token");
      const nuevoEstado = !role.activo;

      await axios.patch(`http://127.0.0.1:8000/api/roles/roles/${role.id}/`, { activo: nuevoEstado }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      await fetchRoles();
    } catch (error) {
      console.error("Error al cambiar estado del rol:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Roles</h2>

      <button
        onClick={() => setShowCreate(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Crear Rol
      </button>

      <table className="min-w-full text-sm text-left bg-white">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {roles.map((role) => (
            <tr key={role.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{role.id}</td>
              <td className="px-4 py-2">{role.nombre}</td>
              <td className="px-4 py-2">
                {role.activo ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
              </td>
              <td className="px-4 py-2 flex space-x-2 justify-center">
                <button
                  onClick={() => handleEdit(role)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleEstado(role)}
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                >
                  {role.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
          {roles.length === 0 && (
            <tr>
              <td colSpan="4" className="px-4 py-4 text-center text-gray-500">
                No hay roles registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Crear */}
      {showCreate && (
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Crear Nuevo Rol</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Crear
              </button>
            </form>
          </div>
        </Modal>
      )}

      {/* Modal Editar */}
      {showEdit && editingRole && (
        <Modal isOpen={showEdit} onClose={handleCancelEdit}>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Editar Rol</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <button
                type="submit"
                className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                Actualizar
              </button>
            </form>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default Roles;

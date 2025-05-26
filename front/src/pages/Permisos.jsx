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

const Permisos = () => {
  const [permisos, setPermisos] = useState([]);
  const [rolesDisponibles, setRolesDisponibles] = useState([]);
  const [formData, setFormData] = useState({ nombre: "", descripcion: "", roles: [] });
  const [editingPermiso, setEditingPermiso] = useState(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);

  const token = localStorage.getItem("token");

  const fetchPermisos = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/roles/permisos/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPermisos(res.data);
    } catch (error) {
      console.error("Error al obtener permisos:", error.response?.data || error.message);
    }
  };

  const fetchRoles = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/roles/roles/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setRolesDisponibles(res.data);
    } catch (error) {
      console.error("Error al obtener roles:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchPermisos();
    fetchRoles();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "roles") {
      const selectedOptions = Array.from(e.target.selectedOptions, (opt) => Number(opt.value));
      setFormData({ ...formData, roles: selectedOptions });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!editingPermiso) {
        await axios.post("http://127.0.0.1:8000/api/roles/permisos/", formData, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.patch(
          `http://127.0.0.1:8000/api/roles/permisos/${editingPermiso.id}/`,
          formData,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      await fetchPermisos();
      setFormData({ nombre: "", descripcion: "", roles: [] });
      setEditingPermiso(null);
      setShowCreate(false);
      setShowEdit(false);
    } catch (error) {
      console.error("Error al guardar permiso:", error.response?.data || error.message);
    }
  };

  const handleEdit = (permiso) => {
    setEditingPermiso(permiso);
    setFormData({
      nombre: permiso.nombre,
      descripcion: permiso.descripcion,
      roles: permiso.roles,
    });
    setShowEdit(true);
  };

  const handleCancelEdit = () => {
    setEditingPermiso(null);
    setFormData({ nombre: "", descripcion: "", roles: [] });
    setShowEdit(false);
  };

  const handleToggleEstado = async (permiso) => {
    try {
      const nuevoEstado = !permiso.activo;
      await axios.patch(
        `http://127.0.0.1:8000/api/roles/permisos/${permiso.id}/`,
        { activo: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchPermisos();
    } catch (error) {
      console.error("Error al cambiar estado del permiso:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Gestión de Permisos</h2>

      <button
        onClick={() => setShowCreate(true)}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4"
      >
        Crear Permiso
      </button>

      <table className="min-w-full text-sm text-left bg-white">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Nombre</th>
            <th className="px-4 py-2">Descripción</th>
            <th className="px-4 py-2">Estado</th>
            <th className="px-4 py-2 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {permisos.map((permiso) => (
            <tr key={permiso.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{permiso.id}</td>
              <td className="px-4 py-2">{permiso.nombre}</td>
              <td className="px-4 py-2">{permiso.descripcion}</td>
              <td className="px-4 py-2">
                {permiso.activo ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
              </td>
              <td className="px-4 py-2 flex space-x-2 justify-center">
                <button
                  onClick={() => handleEdit(permiso)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleToggleEstado(permiso)}
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                >
                  {permiso.activo ? "Desactivar" : "Activar"}
                </button>
              </td>
            </tr>
          ))}
          {permisos.length === 0 && (
            <tr>
              <td colSpan="5" className="px-4 py-4 text-center text-gray-500">
                No hay permisos registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal Crear */}
      {showCreate && (
        <Modal isOpen={showCreate} onClose={() => setShowCreate(false)}>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Crear Nuevo Permiso</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                placeholder="Nombre"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                placeholder="Descripción"
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <select
                name="roles"
                multiple
                value={formData.roles}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              >
                {rolesDisponibles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
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
      {showEdit && editingPermiso && (
        <Modal isOpen={showEdit} onClose={handleCancelEdit}>
          <div className="p-6">
            <h3 className="text-xl font-semibold mb-2">Editar Permiso</h3>
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <textarea
                name="descripcion"
                value={formData.descripcion}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              />
              <select
                name="roles"
                multiple
                value={formData.roles}
                onChange={handleChange}
                className="w-full mb-4 p-2 border border-gray-300 rounded"
              >
                {rolesDisponibles.map((rol) => (
                  <option key={rol.id} value={rol.id}>
                    {rol.nombre}
                  </option>
                ))}
              </select>
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

export default Permisos;

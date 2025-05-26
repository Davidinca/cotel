import React, { useEffect, useState } from 'react';
import axios from 'axios';


// Modal genérico reutilizable
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-30">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 font-bold text-xl"
            aria-label="Cerrar modal"
          >
            &times;
          </button>
        </div>
        <div>{children}</div>
      </div>
    </div>
  );
};

// Formulario para crear usuario




const CrearUsuarioForm = ({ onSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    codigocotel: '',
    persona: '',
    apellidopaterno: '',
    apellidomaterno: '',
    nombres: '',
    fechaingreso: '',
    rol: '',
  });

  const [roles, setRoles] = useState([]);

  useEffect(() => {
    const fetchRoles = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get("http://localhost:8000/api/roles/roles/", { // 👈 Nueva URL
      headers: { Authorization: `Bearer ${token}` },
    });

    console.log("Roles recibidos correctamente:", response.data);

    if (Array.isArray(response.data)) {
      setRoles(response.data); // Guardamos los roles correctamente
    } else {
      console.error("La respuesta no contiene una lista válida:", response.data);
      setRoles([]); // Evita errores si la estructura es incorrecta
    }
  } catch (err) {
    console.error("Error al obtener roles", err);
  }
};
    fetchRoles();
  }, []);

  const handleChange = (e) => {
  setFormData({ 
    ...formData, 
    [e.target.name]: e.target.name === "rol" ? Number(e.target.value) : e.target.value 
  });
};

  const handleSubmit = async (e) => {
  e.preventDefault();
  console.log("Datos que se enviarán:", formData); // 👀 Verifica estructura

  try {
    const token = localStorage.getItem("token");
    await axios.post("http://localhost:8000/api/usuarios/crear/", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    onSuccess();
    onClose();
  } catch (error) {
    console.error("Error al crear usuario", error.response?.data || error.message);
  }
};

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Crear Usuario</h2>

      <input name="codigocotel" placeholder="Código Cotel" className="w-full border p-2 rounded" onChange={handleChange} required />
      <input name="persona" placeholder="Persona" className="w-full border p-2 rounded" onChange={handleChange} required />
      <input name="apellidopaterno" placeholder="Apellido Paterno" className="w-full border p-2 rounded" onChange={handleChange} required />
      <input name="apellidomaterno" placeholder="Apellido Materno" className="w-full border p-2 rounded" onChange={handleChange} required />
      <input name="nombres" placeholder="Nombres" className="w-full border p-2 rounded" onChange={handleChange} required />
      <input name="fechaingreso" type="date" className="w-full border p-2 rounded" onChange={handleChange} required />

      <select name="rol" className="w-full border p-2 rounded" onChange={handleChange} required>
  <option value="">Seleccione un rol</option>
  {Array.isArray(roles) ? (
    roles.map((r) => (
      <option key={r.id} value={r.id}>
        {r.nombre}
      </option>
    ))
  ) : (
    <option disabled>Cargando roles...</option>
  )}
</select>


      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Crear
      </button>
    </form>
  );
};

const EditUsuarioForm = ({ usuario, onSuccess, onClose }) => {
  // Pre-cargamos cada campo del formulario con los datos del usuario
  const [codigocotel, setCodigoCotel] = useState(usuario.codigocotel);
  const [persona, setPersona] = useState(usuario.persona);
  const [apellidopaterno, setApellidoPaterno] = useState(usuario.apellidopaterno);
  const [apellidomaterno, setApellidoMaterno] = useState(usuario.apellidomaterno);
  const [nombres, setNombres] = useState(usuario.nombres);
  const [fechaingreso, setFechaIngreso] = useState(usuario.fechaingreso);
  const [rol, setRol] = useState(usuario.rol);

  // Envía los datos actualizados a la API
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:8000/api/usuarios/${usuario.id}/`,
        { codigocotel, persona, apellidopaterno, apellidomaterno, nombres, fechaingreso, rol },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al actualizar usuario:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <h2 className="text-xl font-semibold mb-2">Editar Usuario</h2>

      <input
        name="codigocotel"
        placeholder="Código Cotel"
        className="w-full border p-2 rounded"
        value={codigocotel}
        onChange={(e) => setCodigoCotel(e.target.value)}
        required
      />

      <input
        name="persona"
        placeholder="Persona"
        className="w-full border p-2 rounded"
        value={persona}
        onChange={(e) => setPersona(e.target.value)}
        required
      />

      <input
        name="apellidopaterno"
        placeholder="Apellido Paterno"
        className="w-full border p-2 rounded"
        value={apellidopaterno}
        onChange={(e) => setApellidoPaterno(e.target.value)}
        required
      />

      <input
        name="apellidomaterno"
        placeholder="Apellido Materno"
        className="w-full border p-2 rounded"
        value={apellidomaterno}
        onChange={(e) => setApellidoMaterno(e.target.value)}
        required
      />

      <input
        name="nombres"
        placeholder="Nombres"
        className="w-full border p-2 rounded"
        value={nombres}
        onChange={(e) => setNombres(e.target.value)}
        required
      />

      <input
        name="fechaingreso"
        type="date"
        className="w-full border p-2 rounded"
        value={fechaingreso}
        onChange={(e) => setFechaIngreso(e.target.value)}
        required
      />

      <input
        name="rol"
        placeholder="Rol"
        className="w-full border p-2 rounded"
        value={rol}
        onChange={(e) => setRol(e.target.value)}
        required
      />

      <div className="flex justify-end space-x-2">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Actualizar
        </button>
      </div>
    </form>
  );
};





// Formulario para migrar usuarios
const MigrarUsuarioForm = ({ onSuccess, onClose }) => {
  const [codigoCotel, setCodigoCotel] = useState('');

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8000/api/usuarios/migrar/',
        { codigocotel: codigoCotel },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error al migrar usuario', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-semibold mb-2">Migrar Usuario</h2>
      <input
        name="codigocotel"
        placeholder="Código Cotel"
        className="w-full border p-2 rounded"
        value={codigoCotel}
        onChange={(e) => setCodigoCotel(e.target.value)}
        required
      />
      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
      >
        Migrar
      </button>
    </form>
  );
};
// Función para cambiar el estado del usuario


const Usuarios = () => {

  const permisos = JSON.parse(localStorage.getItem('user_data'))?.permisos || [];

  const [usuarios, setUsuarios] = useState([]);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [showEditar, setShowEditar] = useState(false);
  const [showCrear, setShowCrear] = useState(false);
  const [showMigrar, setShowMigrar] = useState(false);

  // Función para obtener usuarios y actualizar el estado
  const fetchUsuarios = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:8000/api/usuarios/listar/", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsuarios(response.data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  // Función para refrescar la lista después de editar, crear o migrar
  const refreshUsuarios = () => {
    fetchUsuarios();
  };

  // Función para abrir el modal de edición y asignar el usuario seleccionado
  const handleEdit = (usuario) => {
    setSelectedUsuario(usuario);
    setShowEditar(true);
  };

  // Función para activar/desactivar usuario usando el endpoint correspondiente
  const handleToggleEstado = async (usuario) => {
    try {
      const token = localStorage.getItem("token");
      const nuevoEstado = usuario.estadoempleado === 0 ? 2 : 0;

      await axios.patch(
        `http://localhost:8000/api/usuarios/${usuario.id}/estado/`,
        { estadoempleado: nuevoEstado },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Llamamos a fetchUsuarios para refrescar la lista
      await fetchUsuarios();
    } catch (error) {
      console.error("Error al cambiar estado:", error.response?.data || error.message);
    }
  };

  return (
    <div className="p-6">
      {/* Barra superior con los botones para crear y migrar */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Usuarios</h2>
        <div className="space-x-2">
          {permisos.includes("Crear_Usuario") && (
          <button
            onClick={() => setShowCrear(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Crear Usuario
          </button>
          )}
          {permisos.includes("Migrar_Usuario") && (
          <button
            onClick={() => setShowMigrar(true)}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Migrar Usuario
          </button>
          )}
        </div>
      </div>

      {/* Tabla de usuarios */}
      <table className="min-w-full text-sm text-left bg-white">
        <thead className="bg-gray-100 text-gray-700 uppercase">
          <tr>
            <th className="px-4 py-2">Código Cotel</th>
            <th className="px-4 py-2">Nombres</th>
            <th className="px-4 py-2">Apellidos</th>
            <th className="px-4 py-2">Rol</th>
            <th className="px-4 py-2">Estado</th>
            {permisos.includes("Acciones_Usuario") && (
            <th className="px-4 py-2 text-center">Acciones</th>
            )}
          </tr>
        </thead>
        <tbody>
          {usuarios.map((usuario) => (
            <tr key={usuario.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-2">{usuario.codigocotel}</td>
              <td className="px-4 py-2">{usuario.nombres}</td>
              <td className="px-4 py-2">
                {usuario.apellidopaterno} {usuario.apellidomaterno}
              </td>
              <td className="px-4 py-2">{usuario.rol}</td>
              
              <td className="px-4 py-2">
                {usuario.estadoempleado === 0 ? (
                  <span className="text-green-600 font-semibold">Activo</span>
                ) : (
                  <span className="text-red-600 font-semibold">Inactivo</span>
                )}
                
              </td>
               

              
              {/* Columna de acciones con botón de Editar y togglear estado */}
              {permisos.includes("Acciones_Usuario") && (
              <td className="px-4 py-2 flex space-x-2 justify-center">
                {permisos.includes("Editar_Usuario") && (
                <button
                  onClick={() => handleEdit(usuario)}
                  className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                >
                  Editar
                </button>
                )}
                {permisos.includes("Estado_Usuario") && (
                <button
                  onClick={() => handleToggleEstado(usuario)}
                  className="bg-purple-500 text-white px-3 py-1 rounded hover:bg-purple-600"
                >
                  {usuario.estadoempleado === 0 ? "Desactivar" : "Activar"}
                </button>
                )}
              </td>
              )}
            </tr>
          ))}
          {usuarios.length === 0 && (
            <tr>
              <td colSpan="6" className="px-4 py-4 text-center text-gray-500">
                No hay usuarios registrados.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Modal para crear usuario */}
      {showCrear && (
        <Modal isOpen={showCrear} onClose={() => setShowCrear(false)}>
          <CrearUsuarioForm
            onSuccess={() => {
              refreshUsuarios();
              setShowCrear(false);
            }}
            onClose={() => setShowCrear(false)}
          />
        </Modal>
      )}

      {/* Modal para migrar usuario */}
      {showMigrar && (
        <Modal isOpen={showMigrar} onClose={() => setShowMigrar(false)}>
          <MigrarUsuarioForm
            onSuccess={() => {
              refreshUsuarios();
              setShowMigrar(false);
            }}
            onClose={() => setShowMigrar(false)}
          />
        </Modal>
      )}

      {/* Modal para editar usuario */}
      {showEditar && selectedUsuario && (
        <Modal
          isOpen={showEditar}
          onClose={() => {
            setShowEditar(false);
            setSelectedUsuario(null);
          }}
        >
          <EditUsuarioForm
            usuario={selectedUsuario}
            onSuccess={refreshUsuarios}
            onClose={() => {
              setShowEditar(false);
              setSelectedUsuario(null);
            }}
          />
        </Modal>
      )}
    </div>
  );
};


export default Usuarios;


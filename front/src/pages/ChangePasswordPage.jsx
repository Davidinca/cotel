import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ChangePasswordPage() {
  const [formData, setFormData] = useState({ old_password: "", new_password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post("http://127.0.0.1:8000/api/usuarios/change-password/", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Contraseña cambiada correctamente");
      navigate("/dashboard"); // Redirige al usuario después de cambiar su contraseña
    } catch (error) {
      setError("Error al cambiar la contraseña. Verifica los datos ingresados.");
      console.error("Error en cambio de contraseña:", error.response?.data || error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Cambiar Contraseña</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="password"
        name="old_password"
        placeholder="Contraseña Actual"
        value={formData.old_password}
        onChange={handleChange}
        className="w-full mb-4 px-4 py-2 border rounded-xl"
        required
      />
      <input
        type="password"
        name="new_password"
        placeholder="Nueva Contraseña"
        value={formData.new_password}
        onChange={handleChange}
        className="w-full mb-6 px-4 py-2 border rounded-xl"
        required
      />
      <button type="submit" className="w-full bg-green-600 text-white py-2 rounded-xl hover:bg-green-700">
        Cambiar Contraseña
      </button>
    </form>
  );
}
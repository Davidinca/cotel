import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/authService";

export default function LoginPage() {
  const [codigocotel, setCodigocotel] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Para redirigir

const handleSubmit = async (e) => {
  e.preventDefault();
  try {
    const data = await login(codigocotel, password);
    console.log("Respuesta del login:", data);

    localStorage.setItem("token", data.access);
    localStorage.setItem("refreshToken", data.refresh);
    localStorage.setItem("user_data", JSON.stringify(data.user_data)); // 🔥 GUARDA LOS PERMISOS AQUÍ

    if (!data.user_data.password_changed) {
      console.log("Usuario necesita cambiar su contraseña. Redirigiendo...");
      navigate("/change-password");
    } else {
      console.log("Redirigiendo al dashboard...");
      navigate("/dashboard");
    }
  } catch (err) {
    console.error("Error en login:", err.response?.data || err.message);
    setError("Credenciales inválidas");
  }
};



  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20 p-6 bg-white rounded-2xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Iniciar sesión</h2>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <input
        type="text"
        placeholder="Código COTEL"
        value={codigocotel}
        onChange={(e) => setCodigocotel(e.target.value)}
        className="w-full mb-4 px-4 py-2 border rounded-xl"
        required
      />
      <input
        type="password"
        placeholder="Contraseña"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full mb-6 px-4 py-2 border rounded-xl"
        required
      />
      <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700">
        Ingresar
      </button>
    </form>
  );
}

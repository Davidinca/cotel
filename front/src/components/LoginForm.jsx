// src/components/LoginForm.jsx
import { useState } from 'react';
import { login } from '../services/authService';

export default function LoginForm({ onLoginSuccess }) {
  const [codigocotel, setCodigocotel] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await login(codigocotel, password);
      onLoginSuccess(data); // token y user_data
    } catch (err) {
      setError('Credenciales inválidas');
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

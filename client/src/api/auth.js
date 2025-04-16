import axios from "axios";

const API_URL = "http://localhost:8000/api/usuarios/";

export const login = async (data) => {
  try {
    const response = await axios.post(`${API_URL}login/`, data);
    return response.data;
  } catch (error) {
    throw new Error("Credenciales incorrectas");
  }
};

export const migrarUsuario = async () => {
  try {
    const response = await axios.post(`${API_URL}migrar/`);
    return response.data;
  } catch (error) {
    throw new Error("Error al migrar usuario");
  }
};

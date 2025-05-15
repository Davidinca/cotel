// src/services/authService.js
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000/api/usuarios/login/'; // cambia si usas otro puerto o endpoint

export const login = async (codigocotel, password) => {
  const response = await axios.post(API_URL, { codigocotel, password });
  return response.data;
};

import axios from "axios";

// Si existe VITE_API_BASE_URL:
//   producción → https://api-gestion...
//
// Si NO existe:
//   desarrollo → usar proxy Vite con rutas relativas

const BASE_URL = import.meta.env.VITE_API_BASE_URL
  ? `${import.meta.env.VITE_API_BASE_URL}/api`
  : "/api";

const api = axios.create({
  baseURL: BASE_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Token ${token}`;
  }

  return config;
});

export default api;

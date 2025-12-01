// src/api/index.js
import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000",
  withCredentials: true,
});

export const getHealth = async () => {
  const res = await API.get("/api/health");
  return res.data;
};

export default API;

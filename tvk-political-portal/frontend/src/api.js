// src/api.js
import axios from "axios";

// Read raw env value (Vite)
const rawApiUrl = import.meta.env.VITE_API_URL || "";

// Trim trailing slash if present so we never produce double slashes later
const normalizedEnvUrl = rawApiUrl.replace(/\/+$/, "");

// Fallback to localhost for local development
export const API_URL = normalizedEnvUrl || "http://localhost:5000";
console.log("[api] using API_URL:", API_URL);

// Create Axios Instance
const API = axios.create({
  baseURL: API_URL,
  withCredentials: false, // set to true only if you use cookie-based auth and backend allows credentials
});

// Attach / remove Authorization header helper
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete API.defaults.headers.common["Authorization"];
  }
};

// Example health helper
export const getHealth = async () => {
  const res = await API.get("/api/health");
  return res.data;
};

export default API;

// src/api.js
import axios from "axios";

// Read raw env value
const rawApiUrl = import.meta.env.VITE_API_URL || "";

// Trim trailing slash if present so we never produce double slashes later
const normalizedEnvUrl = rawApiUrl.replace(/\/+$/, "");

// Fallback to localhost for local development
const API_URL = normalizedEnvUrl || "http://localhost:5000";

// Create Axios Instance
const API = axios.create({
  baseURL: (import.meta.env.VITE_API_URL || "").replace(/\/+$/, "") || "http://localhost:5000",
  withCredentials: false, // use false for JWT header flow
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

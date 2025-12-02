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
  // If you use cookie-based auth (server sets a cookie), set to true and make sure server CORS allows credentials
  withCredentials: false,
});

// Attach / remove Authorization header helper
export const setAuthToken = (token) => {
  if (token) {
    API.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    console.log("[api] setAuthToken -> Authorization set");
  } else {
    delete API.defaults.headers.common["Authorization"];
    console.log("[api] setAuthToken -> Authorization removed");
  }
};

// Helper: try read token from common localStorage keys (used only to help debugging / convenience)
function readTokenFromLocalStorage() {
  try {
    const keys = ["API_TOKEN", "AUTH_TOKEN", "token", "jwt", "accessToken"];
    for (const k of keys) {
      const v = localStorage.getItem(k);
      if (v) {
        return v;
      }
    }
    return null;
  } catch (e) {
    return null;
  }
}

// Request interceptor: ensure every outgoing request logs its Authorization header.
// If Authorization is missing, try to attach from localStorage (debugging convenience).
API.interceptors.request.use((config) => {
  // If there is no Authorization header on this axios instance, try localStorage fallback
  if (!config.headers?.Authorization && !API.defaults.headers.common["Authorization"]) {
    const fallback = readTokenFromLocalStorage();
    if (fallback) {
      config.headers = config.headers || {};
      config.headers["Authorization"] = `Bearer ${fallback}`;
      // also set as default so subsequent requests pick it up
      API.defaults.headers.common["Authorization"] = `Bearer ${fallback}`;
      console.log("[api] interceptor -> attached fallback token from localStorage");
    }
  }

  // Log the outgoing Authorization header for debugging (do NOT log token value in production)
  const authHeader = (config.headers && (config.headers.Authorization || config.headers.authorization)) || API.defaults.headers.common["Authorization"];
  console.log("[api] outgoing request:", config.method?.toUpperCase(), config.url, "Authorization present:", !!authHeader);

  return config;
}, (error) => {
  return Promise.reject(error);
});

// Example health helper
export const getHealth = async () => {
  const res = await API.get("/api/health");
  return res.data;
};

export default API;

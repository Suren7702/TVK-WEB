import axios from "axios";

// Read raw env value (Vite)
const rawApiUrl = import.meta.env.VITE_API_URL || "";

// Trim trailing slash if present so we never produce double slashes later
const normalizedEnvUrl = rawApiUrl.replace(/\/+$/, "");

// Fallback to localhost for local development
export const API_URL = normalizedEnvUrl || "https://tvk-web.onrender.com";
console.log("[api] using API_URL:", API_URL);

// Get the secret key from your client's environment variables
const CLIENT_API_KEY = import.meta.env.VITE_API_KEY;


// Create Axios Instance
const API = axios.create({
  baseURL: API_URL,
  withCredentials: false,
  
  // FIX: Add the API key header globally for all secured routes
  headers: {
    'x-api-key': CLIENT_API_KEY, 
  }
});

// 💡 FIX 1: Ensure setAuthToken is explicitly exported so AdminLogin.jsx can import it
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

// Helper: try read token from common localStorage keys (re-added function logic)
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


// 💡 FIX 2: Ensure getHealth is explicitly exported so App.jsx can import it
// Example health helper (still bypasses the global API instance)
export const getHealth = async () => {
  // This uses base axios, so it bypasses the security check. Good!
  const res = await axios.get(`${API_URL}/`);
  return res.data;
};

export default API;
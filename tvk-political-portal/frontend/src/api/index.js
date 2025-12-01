import axios from "axios";

// Read API URL from Vite environment variable
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// Example function
export const getHealth = async () => {
  const response = await API.get("/api/health");
  return response.data;
};

export default API;

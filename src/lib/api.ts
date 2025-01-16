import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_DEFAULT_API,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

export default api;

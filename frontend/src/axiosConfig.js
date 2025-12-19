import axios from "axios";

const api = axios.create({
  baseURL: "/api", 
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("x-auth-token");
  if (token) config.headers["x-auth-token"] = token;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("x-auth-token");
      localStorage.removeItem("username");

      window.dispatchEvent(new Event("force-logout"));
    }
    return Promise.reject(error);
  }
);

export default api;
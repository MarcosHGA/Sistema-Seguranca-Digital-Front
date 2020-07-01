import axios from "axios";
import { logout } from "../auth";
import { useHistory } from "react-router-dom";
const api = axios.create({
  baseURL: "https://localhost:44350/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  async (config) => {
    const token = JSON.parse(localStorage.getItem("REACT_TOKEN_AUTH_KEY"));
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log({ error });
    const history = useHistory();
    if (error.response.status === 401) {
      alert(
        "Sua sessão expirou, você será redirecionado para a tela de login!"
      );
      logout();
      setTimeout(history.push("/login"), 5000);
    } else {
      return Promise.reject(error);
    }
  }
);

export default api;

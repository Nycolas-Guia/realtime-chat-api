import axios from "axios";

const API_BASE_URL = "http://localhost:8081";

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// Interceptor de REQUEST: injeta o JWT em toda chamada protegida
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("@chat-app:token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Interceptor de RESPONSE: trata token expirado/inválido (401)
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem("@chat-app:token");
            localStorage.removeItem("@chat-app:user");

            // Evita redirecionar em loop se já estiver na tela de login
            if (window.location.pathname !== "/login") {
                window.location.href = "/login";
            }
        }

        return Promise.reject(error);
    }
);

export default api;
export { API_BASE_URL };
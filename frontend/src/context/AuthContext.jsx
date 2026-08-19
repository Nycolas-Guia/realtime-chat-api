import { createContext, useContext, useState, useEffect } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "@chat-app:token";
const USER_KEY = "@chat-app:user";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restaura sessão salva no localStorage ao carregar a app
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
        }

        setLoading(false);
    }, []);

    /**
     * Login: chama o endpoint de autenticação do backend.
     */
    async function login({ email, password }) {
        const response = await api.post("/api/auth/login", { email, password });
        const jwtToken = response.data.token;
        const userData = { email };

        localStorage.setItem(TOKEN_KEY, jwtToken);
        localStorage.setItem(USER_KEY, JSON.stringify(userData));

        setToken(jwtToken);
        setUser(userData);

        return userData;
    }

    /**
     * Cadastro: cria o usuário no backend na rota /api/users.
     */
    async function register({ username, email, password }) {
        const response = await api.post("/api/users", {
            username,
            email,
            password,
        });

        return response.data;
    }

    function logout() {
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem(USER_KEY);
        setToken(null);
        setUser(null);
    }

    const value = {
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error("useAuth deve ser usado dentro de um AuthProvider");
    }

    return context;
}
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import api from "../services/api";

const AuthContext = createContext(null);

const TOKEN_KEY = "@chat-app:token";
const USER_KEY = "@chat-app:user";

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Movido para DENTRO do provider para poder usar o setUser
    const fetchUserProfile = useCallback(async (currentToken) => {
        try {
            const config = currentToken ? { headers: { Authorization: `Bearer ${currentToken}` } } : {};
            const response = await api.get("/api/users/me", config);

            setUser(response.data);
            localStorage.setItem(USER_KEY, JSON.stringify(response.data));
        } catch (err) {
            console.error("Erro ao buscar dados do usuário logado:", err);
        }
    }, []);

    // Restaura sessão salva no localStorage ao carregar a app
    useEffect(() => {
        const storedToken = localStorage.getItem(TOKEN_KEY);
        const storedUser = localStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));

            // Atualiza os dados silenciosamente em background para garantir que o apelido está atualizado
            fetchUserProfile(storedToken);
        }

        setLoading(false);
    }, [fetchUserProfile]);

    /**
     * Login: chama o endpoint de autenticação do backend.
     */
    async function login({ email, password }) {
        const response = await api.post("/api/auth/login", { email, password });
        const jwtToken = response.data.token;

        // Salva o token para as próximas requisições funcionarem
        localStorage.setItem(TOKEN_KEY, jwtToken);
        setToken(jwtToken);

        // Busca o perfil completo (agora com username e displayName) do backend
        try {
            const profileRes = await api.get("/api/users/me", {
                headers: { Authorization: `Bearer ${jwtToken}` }
            });
            const userData = profileRes.data;

            localStorage.setItem(USER_KEY, JSON.stringify(userData));
            setUser(userData);
            return userData;
        } catch (err) {
            // Fallback de segurança
            const fallbackUser = { email };
            localStorage.setItem(USER_KEY, JSON.stringify(fallbackUser));
            setUser(fallbackUser);
            return fallbackUser;
        }
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
        fetchUserProfile, // Disponível para uso externo
        updateUser: setUser, // Permite que o SettingsModal altere a UI na mesma hora
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
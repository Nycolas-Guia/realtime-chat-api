import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import ChatPage from "./pages/ChatPage";

function PrivateRoute({ children }) {
    const { isAuthenticated, loading } = useAuth();

    if (loading) {
        return (
            <div className="flex h-screen w-screen items-center justify-center bg-discord-bg-primary text-sm text-discord-text-muted">
                Carregando...
            </div>
        );
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default function App() {
    return (
        <Routes>
            <Route path="/login" element={<LoginPage />} />

            <Route
                path="/"
                element={
                    <PrivateRoute>
                        <ChatPage />
                    </PrivateRoute>
                }
            />

            {/* Qualquer rota desconhecida volta para a raiz */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    );
}
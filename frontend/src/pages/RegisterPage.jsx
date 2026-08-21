import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    async function handleSubmit(e) {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post("/api/users", {
                username,
                email,
                password
            });

            navigate("/login");
        } catch (err) {
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage ?? "Não foi possível criar sua conta.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-discord-bg-tertiary px-4">
            <div className="w-full max-w-md rounded-lg bg-discord-bg-secondary p-8 shadow-xl">
                {/* Cabeçalho */}
                <div className="mb-6 text-center">
                    <h1 className="text-2xl font-bold text-white">Criar uma conta</h1>
                    <p className="mt-1 text-sm text-discord-text-muted">É rápido e fácil.</p>
                </div>

                {/* Mensagem de erro */}
                {error && (
                    <div className="mb-4 rounded bg-discord-red/10 px-3 py-2 text-sm text-discord-red">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Username */}
                    <div>
                        <label
                            htmlFor="username"
                            className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted"
                        >
                            Nome de usuário
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                            placeholder="seu_usuario"
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label
                            htmlFor="email"
                            className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                            placeholder="voce@exemplo.com"
                        />
                    </div>

                    {/* Senha */}
                    <div>
                        <label
                            htmlFor="password"
                            className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted"
                        >
                            Senha
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            minLength={6}
                            className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                            placeholder="••••••••"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded bg-discord-blurple py-2.5 text-sm font-medium text-white transition-colors hover:bg-discord-blurple-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Aguarde..." : "Cadastrar"}
                    </button>
                </form>

                {/* Link para login */}
                <p className="mt-4 text-sm text-discord-text-muted">
                    Já tem uma conta?{" "}
                    <Link to="/login" className="font-medium text-discord-link hover:underline">
                        Entrar
                    </Link>
                </p>
            </div>
        </div>
    );
}
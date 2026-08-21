import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    // A integração com a API fica por conta do usuário.
    async function handleSubmit(e) {
        e.preventDefault();
        setLoading(true);
        setSubmitted(true);
        setLoading(false);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-discord-bg-tertiary px-4">
            <div className="w-full max-w-md rounded-lg bg-discord-bg-secondary p-8 shadow-xl">
                {submitted ? (
                    <div className="text-center">
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-discord-green/10 text-discord-green">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h1 className="text-xl font-bold text-white">Verifique seu e-mail</h1>
                        <p className="mt-2 text-sm text-discord-text-muted">
                            Se existir uma conta associada a{" "}
                            <span className="font-medium text-discord-text-normal">{email}</span>, enviamos
                            um link para redefinir sua senha.
                        </p>
                        <Link
                            to="/login"
                            className="mt-6 inline-block text-sm font-medium text-discord-link hover:underline"
                        >
                            Voltar para o login
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="mb-6 text-center">
                            <h1 className="text-2xl font-bold text-white">Esqueceu sua senha?</h1>
                            <p className="mt-1 text-sm text-discord-text-muted">
                                Sem problemas. Informe seu e-mail e enviaremos um link de redefinição.
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">
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

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full rounded bg-discord-blurple py-2.5 text-sm font-medium text-white transition-colors hover:bg-discord-blurple-hover disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                {loading ? "Enviando..." : "Enviar Link de Redefinição"}
                            </button>
                        </form>

                        <p className="mt-4 text-center text-sm text-discord-text-muted">
                            <Link to="/login" className="font-medium text-discord-link hover:underline">
                                ← Voltar para o login
                            </Link>
                        </p>
                    </>
                )}
            </div>
        </div>
    );
}

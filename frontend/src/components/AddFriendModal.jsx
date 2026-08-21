import { useState } from "react";
import Modal from "./Modal";
import api from "../services/api";

export default function AddFriendModal({ isOpen, onClose, onRequestSent }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");
        setLoading(true);

        try {
            await api.post("/api/friends/request", {
                username: username.toLowerCase().trim()
            });

            setSuccess("Pedido de amizade enviado!");
            setUsername("");
            if (onRequestSent) onRequestSent();
            setTimeout(() => {
                setSuccess("");
                onClose();
            }, 1000);
        } catch (err) {
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage ?? "Não foi possível enviar o pedido de amizade.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Amigo">
            <p className="mb-4 text-sm text-discord-text-muted">
                Você pode adicionar um amigo usando o nome de usuário único dele.
            </p>

            {error && (
                <div className="mb-4 rounded bg-discord-red/10 px-3 py-2 text-sm text-discord-red">
                    {error}
                </div>
            )}

            {success && (
                <div className="mb-4 rounded bg-discord-green/10 px-3 py-2 text-sm text-discord-green">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="friend-username"
                        className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted"
                    >
                        Nome de Usuário
                    </label>
                    <input
                        id="friend-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Ex: noob_saibot"
                        className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                    />
                </div>

                <div className="flex justify-end gap-2 pt-1">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="rounded px-4 py-2 text-sm font-medium text-discord-text-muted hover:underline disabled:opacity-60"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!username.trim() || loading}
                        className="rounded bg-discord-blurple px-4 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Enviando..." : "Enviar Pedido de Amizade"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
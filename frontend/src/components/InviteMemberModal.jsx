import { useState } from "react";
import Modal from "./Modal";
import api from "../services/api";

export default function InviteMemberModal({ isOpen, onClose, roomName, roomId }) {
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            await api.post(`/api/rooms/${roomId}/members`, { username });

            setUsername("");
            onClose();
        } catch (err) {
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage ?? "Não foi possível enviar o convite. Verifique o username.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Convidar Membro">
            <p className="mb-4 text-sm text-discord-text-muted">
                Convide alguém para entrar em{" "}
                <span className="font-semibold text-discord-text-normal">#{roomName}</span> pelo
                nome de usuário.
            </p>

            {error && (
                <div className="mb-4 rounded bg-discord-red/10 px-3 py-2 text-sm text-discord-red">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="invite-username"
                        className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted"
                    >
                        Nome de Usuário
                    </label>
                    <input
                        id="invite-username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        placeholder="Ex: nycolas_guia"
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
                        {loading ? "Enviando..." : "Enviar Convite"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
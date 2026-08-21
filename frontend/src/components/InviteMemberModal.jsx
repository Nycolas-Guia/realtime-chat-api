import { useState } from "react";
import Modal from "./Modal";
import api from "../services/api"; // 1. Importa a nossa API conectada ao backend

// 2. Adicionamos o roomId aqui nas props!
export default function InviteMemberModal({ isOpen, onClose, roomName, roomId }) {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            // 3. O "Cabo" conectado: Faz o POST para adicionar o membro
            await api.post(`/api/rooms/${roomId}/members`, { email });

            // Sucesso! Limpa o input e fecha o modal
            setEmail("");
            onClose();
        } catch (err) {
            const backendMessage = err?.response?.data?.message;
            setError(backendMessage ?? "Não foi possível enviar o convite. Verifique o e-mail.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Convidar Membro">
            <p className="mb-4 text-sm text-discord-text-muted">
                Convide alguém para entrar em{" "}
                <span className="font-semibold text-discord-text-normal">#{roomName}</span> pelo
                e-mail.
            </p>

            {/* Mensagem de erro caso o backend recuse (ex: usuário não existe) */}
            {error && (
                <div className="mb-4 rounded bg-discord-red/10 px-3 py-2 text-sm text-discord-red">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="invite-email"
                        className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted"
                    >
                        E-mail
                    </label>
                    <input
                        id="invite-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="pessoa@exemplo.com"
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
                        disabled={!email.trim() || loading}
                        className="rounded bg-discord-blurple px-4 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        {loading ? "Enviando..." : "Enviar Convite"}
                    </button>
                </div>
            </form>
        </Modal>
    );
}
import { useState } from "react";
import Modal from "./Modal";

export default function AddFriendModal({ isOpen, onClose }) {
    const [username, setUsername] = useState("");

    // A integração com a API fica por conta do usuário.
    const handleSubmit = (e) => {
        e.preventDefault();
        setUsername("");
        onClose();
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Amigo">
            <p className="mb-4 text-sm text-discord-text-muted">
                Você pode adicionar um amigo com o nome de usuário dele.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label
                        htmlFor="friend-username"
                        className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted"
                    >
                        E-mail
                    </label>
                    <input
                        id="invite-username"
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
                        className="rounded px-4 py-2 text-sm font-medium text-discord-text-muted hover:underline"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={!email.trim()}
                        className="rounded bg-discord-blurple px-4 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover disabled:cursor-not-allowed disabled:opacity-60"
                    >
                        Enviar Pedido de Amizade
                    </button>
                </div>
            </form>
        </Modal>
    );
}

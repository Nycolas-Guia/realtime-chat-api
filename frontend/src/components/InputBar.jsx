import { useState } from "react";

export default function InputBar({ onSend, roomName = "sala", disabled = false }) {
    const [message, setMessage] = useState("");

    function handleSubmit(e) {
        e.preventDefault();

        const trimmed = message.trim();
        if (!trimmed || disabled) return;

        onSend?.(trimmed);
        setMessage("");
    }

    function handleKeyDown(e) {
        // Enter envia, Shift+Enter quebra linha
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSubmit(e);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="px-4 pb-6 pt-2">
            <div className="flex items-end gap-2 rounded-lg bg-discord-bg-input px-4 py-2.5">
        <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            rows={1}
            placeholder={
                disabled
                    ? "Conectando ao servidor..."
                    : `Conversar em #${roomName}`
            }
            className="max-h-32 flex-1 resize-none bg-transparent text-sm text-discord-text-normal placeholder-discord-text-muted outline-none disabled:cursor-not-allowed"
        />

                <button
                    type="submit"
                    disabled={disabled || !message.trim()}
                    title="Enviar mensagem"
                    className="shrink-0 rounded-full p-1.5 text-discord-text-muted transition-colors hover:text-discord-blurple disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:text-discord-text-muted"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M3.4 20.6l17.45-8.73a1 1 0 000-1.79L3.4 1.35a1 1 0 00-1.43 1.05l1.55 7.05h9.98a.5.5 0 010 1H3.52L1.97 19.5a1 1 0 001.43 1.1z" />
                    </svg>
                </button>
            </div>
        </form>
    );
}
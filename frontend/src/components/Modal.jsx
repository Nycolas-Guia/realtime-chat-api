import { useEffect } from "react";

/**
 * Modal genérico centralizado, usado como base para os modais de ação
 * (Adicionar Amigo, Convidar Membro, Configurações, etc).
 */
export default function Modal({ isOpen, onClose, title, children, maxWidth = "max-w-md" }) {
    useEffect(() => {
        if (!isOpen) return;

        function handleKeyDown(e) {
            if (e.key === "Escape") onClose();
        }

        document.addEventListener("keydown", handleKeyDown);
        return () => document.removeEventListener("keydown", handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 px-4"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className={`w-full ${maxWidth} rounded-lg bg-discord-bg-secondary shadow-xl`}
            >
                {title && (
                    <div className="flex items-center justify-between border-b border-discord-border px-5 py-4">
                        <h2 className="text-lg font-semibold text-white">{title}</h2>
                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded p-1 text-discord-text-muted hover:bg-discord-bg-primary hover:text-discord-text-normal"
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                )}

                <div className="p-5">{children}</div>
            </div>
        </div>
    );
}

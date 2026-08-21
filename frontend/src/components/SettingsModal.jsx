import { useState } from "react";
import { useAuth } from "../context/AuthContext";

const SECTIONS = [
    { id: "account", label: "Minha Conta" },
    { id: "security", label: "Alterar Senha" },
];

function AccountSection({ username, setUsername, email, setEmail, avatarPreview, onAvatarChange }) {
    return (
        <div className="space-y-6">
            {/* Foto de perfil */}
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-discord-blurple text-xl font-semibold text-white">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Prévia da foto de perfil" className="h-full w-full object-cover" />
                    ) : (
                        (username || "?").charAt(0).toUpperCase()
                    )}
                </div>
                <label className="cursor-pointer rounded bg-discord-bg-primary px-3 py-2 text-sm font-medium text-discord-text-normal hover:bg-discord-bg-input">
                    Trocar Foto
                    <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                </label>
            </div>

            <div>
                <label htmlFor="settings-username" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    Nome de Usuário
                </label>
                <input
                    id="settings-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                />
            </div>

            <div>
                <label htmlFor="settings-email" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    E-mail
                </label>
                <input
                    id="settings-email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="rounded bg-discord-blurple px-4 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover"
                >
                    Salvar Alterações
                </button>
            </div>

            {/* Zona de perigo */}
            <div className="rounded border border-discord-red/30 bg-discord-red/5 p-4">
                <h3 className="text-sm font-semibold text-discord-red">Zona de Perigo</h3>
                <p className="mt-1 text-xs text-discord-text-muted">
                    Excluir sua conta é uma ação permanente e não pode ser desfeita.
                </p>
                <button
                    type="button"
                    className="mt-3 rounded bg-discord-red px-4 py-2 text-sm font-medium text-white hover:bg-discord-red/80"
                >
                    Excluir Conta
                </button>
            </div>
        </div>
    );
}

function SecuritySection({ currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword }) {
    return (
        <div className="space-y-4">
            <div>
                <label htmlFor="current-password" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    Senha Atual
                </label>
                <input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label htmlFor="new-password" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    Nova Senha
                </label>
                <input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                    placeholder="••••••••"
                />
            </div>

            <div>
                <label htmlFor="confirm-password" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    Confirmar Nova Senha
                </label>
                <input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                    placeholder="••••••••"
                />
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="button"
                    className="rounded bg-discord-blurple px-4 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover"
                >
                    Atualizar Senha
                </button>
            </div>
        </div>
    );
}

export default function SettingsModal({ isOpen, onClose }) {
    const { user } = useAuth();

    const [activeSection, setActiveSection] = useState("account");
    const [username, setUsername] = useState(user?.email?.split("@")[0] ?? "");
    const [email, setEmail] = useState(user?.email ?? "");
    const [avatarPreview, setAvatarPreview] = useState(null);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    if (!isOpen) return null;

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-discord-bg-tertiary">
            {/* Navegação lateral de seções */}
            <div className="flex w-60 shrink-0 flex-col bg-discord-bg-secondary py-6">
                <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-discord-text-muted">
                    Configurações da Conta
                </p>
                <nav className="flex-1 space-y-0.5 px-3">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => setActiveSection(section.id)}
                            className={`w-full rounded px-2.5 py-2 text-left text-sm font-medium transition-colors ${
                                activeSection === section.id
                                    ? "bg-discord-bg-primary text-white"
                                    : "text-discord-text-muted hover:bg-discord-bg-primary/60 hover:text-discord-text-normal"
                            }`}
                        >
                            {section.label}
                        </button>
                    ))}
                </nav>
            </div>

            {/* Conteúdo da seção ativa */}
            <div className="relative flex-1 overflow-y-auto">
                <button
                    type="button"
                    onClick={onClose}
                    className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full border-2 border-discord-text-muted text-discord-text-muted hover:border-white hover:text-white"
                    title="Fechar (Esc)"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <div className="mx-auto max-w-xl px-8 py-12">
                    <h1 className="mb-6 text-xl font-bold text-white">
                        {SECTIONS.find((s) => s.id === activeSection)?.label}
                    </h1>

                    {activeSection === "account" && (
                        <AccountSection
                            username={username}
                            setUsername={setUsername}
                            email={email}
                            setEmail={setEmail}
                            avatarPreview={avatarPreview}
                            onAvatarChange={handleAvatarChange}
                        />
                    )}

                    {activeSection === "security" && (
                        <SecuritySection
                            currentPassword={currentPassword}
                            setCurrentPassword={setCurrentPassword}
                            newPassword={newPassword}
                            setNewPassword={setNewPassword}
                            confirmPassword={confirmPassword}
                            setConfirmPassword={setConfirmPassword}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

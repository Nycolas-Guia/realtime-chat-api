import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

const SECTIONS = [
    { id: "account", label: "Minha Conta" },
    { id: "security", label: "Alterar Senha" },
];

function AccountSection({ displayName, setDisplayName, email, avatarPreview, onAvatarChange, onSave, loading, status }) {
    return (
        <form onSubmit={onSave} className="space-y-6">
            {/* Status Feedback */}
            {status.message && (
                <div className={`rounded px-3 py-2 text-sm ${status.type === "error" ? "bg-discord-red/10 text-discord-red" : "bg-discord-green/10 text-discord-green"}`}>
                    {status.message}
                </div>
            )}

            {/* Foto de perfil */}
            <div className="flex items-center gap-4">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-discord-blurple text-xl font-semibold text-white">
                    {avatarPreview ? (
                        <img src={avatarPreview} alt="Prévia da foto de perfil" className="h-full w-full object-cover" />
                    ) : (
                        (displayName || "?").charAt(0).toUpperCase()
                    )}
                </div>
                <label className="cursor-pointer rounded bg-discord-bg-primary px-3 py-2 text-sm font-medium text-discord-text-normal hover:bg-discord-bg-input">
                    Trocar Foto
                    <input type="file" accept="image/*" className="hidden" onChange={onAvatarChange} />
                </label>
            </div>

            <div>
                <label htmlFor="settings-displayname" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    Apelido (Display Name)
                </label>
                <input
                    id="settings-displayname"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                    placeholder="Como você quer ser chamado?"
                />
            </div>

            <div>
                <label htmlFor="settings-email" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    E-mail (Apenas leitura)
                </label>
                <input
                    id="settings-email"
                    type="email"
                    value={email}
                    disabled
                    className="w-full cursor-not-allowed rounded border-none bg-discord-bg-primary px-3 py-2.5 text-sm text-discord-text-muted outline-none opacity-70"
                />
            </div>

            <div className="flex justify-end">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-discord-blurple px-4 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Salvando..." : "Salvar Alterações"}
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
        </form>
    );
}

function SecuritySection({ currentPassword, setCurrentPassword, newPassword, setNewPassword, confirmPassword, setConfirmPassword, onSave, loading, status }) {
    return (
        <form onSubmit={onSave} className="space-y-4">
            {/* Status Feedback */}
            {status.message && (
                <div className={`rounded px-3 py-2 text-sm ${status.type === "error" ? "bg-discord-red/10 text-discord-red" : "bg-discord-green/10 text-discord-green"}`}>
                    {status.message}
                </div>
            )}

            <div>
                <label htmlFor="current-password" className="mb-1.5 block text-xs font-semibold uppercase text-discord-text-muted">
                    Senha Atual
                </label>
                <input
                    id="current-password"
                    type="password"
                    required
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
                    required
                    minLength={6}
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
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full rounded border-none bg-discord-bg-input px-3 py-2.5 text-sm text-discord-text-normal outline-none ring-1 ring-transparent focus:ring-discord-blurple"
                    placeholder="••••••••"
                />
            </div>

            <div className="flex justify-end pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded bg-discord-blurple px-4 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover disabled:cursor-not-allowed disabled:opacity-60"
                >
                    {loading ? "Atualizando..." : "Atualizar Senha"}
                </button>
            </div>
        </form>
    );
}

export default function SettingsModal({ isOpen, onClose }) {
    const { user, updateUser, logout } = useAuth();


    // Estados da Minha Conta
    const [displayName, setDisplayName] = useState(user?.displayName ?? user?.username ?? "");
    const [accountLoading, setAccountLoading] = useState(false);
    const [accountStatus, setAccountStatus] = useState({ type: "", message: "" });
    const email = user?.email ?? "";
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [activeSection, setActiveSection] = useState("account");

    // Estados da Segurança (Senha)
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [securityLoading, setSecurityLoading] = useState(false);
    const [securityStatus, setSecurityStatus] = useState({ type: "", message: "" });

    if (!isOpen) return null;

    const handleAvatarChange = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setAvatarPreview(URL.createObjectURL(file));
    };

    // --- CONEXÃO AXIOS: Salvar Apelido ---
    const handleSaveAccount = async (e) => {
        e.preventDefault();
        setAccountStatus({type: "", message: ""});
        setAccountLoading(true);

        try {
            await api.put("/api/users/me", {displayName});

            // Atualiza o estado global imediatamente para refletir na Sidebar
            updateUser((prev) => ({...prev, displayName}));

            setAccountStatus({type: "success", message: "Perfil atualizado com sucesso!"});
        } catch (error) {
            setAccountStatus({type: "error", message: "Erro ao atualizar o perfil."});
        } finally {
            setAccountLoading(false);
        }
    };

    // --- CONEXÃO AXIOS: Alterar Senha ---
    const handleSaveSecurity = async (e) => {
        e.preventDefault();
        setSecurityStatus({ type: "", message: "" });

        if (newPassword !== confirmPassword) {
            setSecurityStatus({ type: "error", message: "As novas senhas não coincidem." });
            return;
        }

        setSecurityLoading(true);
        try {
            await api.put("/api/users/me", { currentPassword, newPassword });
            setSecurityStatus({ type: "success", message: "Senha alterada com sucesso!" });
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
        } catch (error) {
            const backendMessage = error?.response?.data?.message;
            setSecurityStatus({ type: "error", message: backendMessage ?? "A senha atual está incorreta." });
        } finally {
            setSecurityLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex bg-discord-bg-tertiary">
            <div className="flex w-60 shrink-0 flex-col bg-discord-bg-secondary py-6">
                <p className="px-5 pb-2 text-xs font-semibold uppercase tracking-wide text-discord-text-muted">
                    Configurações da Conta
                </p>
                <nav className="flex-1 space-y-0.5 px-3">
                    {SECTIONS.map((section) => (
                        <button
                            key={section.id}
                            type="button"
                            onClick={() => {
                                setActiveSection(section.id);
                                setAccountStatus({ type: "", message: "" });
                                setSecurityStatus({ type: "", message: "" });
                            }}
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
                            displayName={displayName}
                            setDisplayName={setDisplayName}
                            email={email}
                            avatarPreview={avatarPreview}
                            onAvatarChange={handleAvatarChange}
                            onSave={handleSaveAccount}
                            loading={accountLoading}
                            status={accountStatus}
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
                            onSave={handleSaveSecurity}
                            loading={securityLoading}
                            status={securityStatus}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
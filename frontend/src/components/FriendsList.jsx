import { useState } from "react";
import AddFriendModal from "./AddFriendModal";

// Dados de exemplo — substituir pelos dados vindos da API.
const MOCK_FRIENDS = [
    { id: 1, name: "ana.silva", status: "online" },
    { id: 2, name: "bruno_dev", status: "online" },
    { id: 3, name: "carla.souza", status: "offline" },
    { id: 4, name: "diego99", status: "offline" },
];

const MOCK_PENDING = [
    { id: 5, name: "eduardo.lima", direction: "sent" },
    { id: 6, name: "fernanda.rocha", direction: "received" },
];

const TABS = [
    { id: "online", label: "Online" },
    { id: "all", label: "Todos" },
    { id: "pending", label: "Pendentes" },
];

function FriendRow({ name, status }) {
    return (
        <li className="flex items-center gap-3 rounded px-2 py-2 hover:bg-discord-bg-primary/60">
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-discord-blurple text-sm font-semibold text-white">
                {name.charAt(0).toUpperCase()}
                <span
                    className={`absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full border-2 border-discord-bg-primary ${
                        status === "online" ? "bg-discord-green" : "bg-discord-text-muted"
                    }`}
                />
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-discord-text-normal">{name}</p>
                <p className="truncate text-xs text-discord-text-muted">
                    {status === "online" ? "Online" : "Offline"}
                </p>
            </div>
        </li>
    );
}

function PendingRow({ name, direction }) {
    const isReceived = direction === "received";

    return (
        <li className="flex items-center gap-3 rounded px-2 py-2 hover:bg-discord-bg-primary/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-discord-blurple text-sm font-semibold text-white">
                {name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-discord-text-normal">{name}</p>
                <p className="truncate text-xs text-discord-text-muted">
                    {isReceived ? "Pedido recebido" : "Pedido enviado"}
                </p>
            </div>
            {isReceived ? (
                <div className="flex shrink-0 gap-1.5">
                    <button
                        type="button"
                        className="rounded-full bg-discord-bg-primary p-1.5 text-discord-green hover:bg-discord-green hover:text-white"
                        title="Aceitar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="rounded-full bg-discord-bg-primary p-1.5 text-discord-red hover:bg-discord-red hover:text-white"
                        title="Recusar"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            ) : (
                <span className="shrink-0 text-xs text-discord-text-muted">Aguardando</span>
            )}
        </li>
    );
}

export default function FriendsList() {
    const [activeTab, setActiveTab] = useState("online");
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);

    const onlineFriends = MOCK_FRIENDS.filter((f) => f.status === "online");

    let content;
    if (activeTab === "pending") {
        content =
            MOCK_PENDING.length === 0 ? (
                <p className="px-2 text-sm text-discord-text-muted">Nenhum pedido pendente.</p>
            ) : (
                <ul className="space-y-0.5">
                    {MOCK_PENDING.map((p) => (
                        <PendingRow key={p.id} name={p.name} direction={p.direction} />
                    ))}
                </ul>
            );
    } else {
        const list = activeTab === "online" ? onlineFriends : MOCK_FRIENDS;
        content =
            list.length === 0 ? (
                <p className="px-2 text-sm text-discord-text-muted">Nenhum amigo por aqui ainda.</p>
            ) : (
                <ul className="space-y-0.5">
                    {list.map((f) => (
                        <FriendRow key={f.id} name={f.name} status={f.status} />
                    ))}
                </ul>
            );
    }

    return (
        <div className="flex h-full flex-col">
            {/* Cabeçalho da aba de amigos */}
            <div className="border-b border-discord-border px-3 py-3">
                <button
                    type="button"
                    onClick={() => setIsAddFriendOpen(true)}
                    className="flex w-full items-center justify-center gap-1.5 rounded bg-discord-blurple px-3 py-2 text-sm font-medium text-white hover:bg-discord-blurple-hover"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-7a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                    </svg>
                    Adicionar Amigo
                </button>
            </div>

            {/* Abas Online / Todos / Pendentes */}
            <div className="flex gap-1 border-b border-discord-border px-2 py-2">
                {TABS.map((tab) => (
                    <button
                        key={tab.id}
                        type="button"
                        onClick={() => setActiveTab(tab.id)}
                        className={`rounded px-2.5 py-1 text-xs font-semibold transition-colors ${
                            activeTab === tab.id
                                ? "bg-discord-bg-primary text-white"
                                : "text-discord-text-muted hover:bg-discord-bg-primary/60 hover:text-discord-text-normal"
                        }`}
                    >
                        {tab.label}
                        {tab.id === "pending" && MOCK_PENDING.length > 0 && (
                            <span className="ml-1.5 rounded-full bg-discord-red px-1.5 py-0.5 text-[10px] text-white">
                                {MOCK_PENDING.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">{content}</div>

            <AddFriendModal isOpen={isAddFriendOpen} onClose={() => setIsAddFriendOpen(false)} />
        </div>
    );
}

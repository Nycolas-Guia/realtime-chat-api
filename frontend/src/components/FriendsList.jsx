import { useState, useEffect, useCallback } from "react";
import AddFriendModal from "./AddFriendModal";
import api from "../services/api";

const TABS = [
    { id: "all", label: "Todos" },
    { id: "pending", label: "Pendentes" },
];

function FriendRow({ displayName, username }) {
    return (
        <li className="flex items-center gap-3 rounded px-2 py-2 hover:bg-discord-bg-primary/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-discord-blurple text-sm font-semibold text-white">
                {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-discord-text-normal">{displayName}</p>
                <p className="truncate text-xs text-discord-text-muted">@{username}</p>
            </div>
        </li>
    );
}

function PendingRow({ friendshipId, displayName, username, onAccept, onReject, processingId }) {
    const isProcessing = processingId === friendshipId;

    return (
        <li className="flex items-center gap-3 rounded px-2 py-2 hover:bg-discord-bg-primary/60">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-discord-blurple text-sm font-semibold text-white">
                {displayName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-discord-text-normal">{displayName}</p>
                <p className="truncate text-xs text-discord-text-muted">@{username}</p>
            </div>
            <div className="flex shrink-0 gap-1.5">
                <button
                    type="button"
                    onClick={() => onAccept(friendshipId)}
                    disabled={isProcessing}
                    className="rounded-full bg-discord-bg-primary p-1.5 text-discord-green hover:bg-discord-green hover:text-white disabled:opacity-50"
                    title="Aceitar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </button>
                <button
                    type="button"
                    onClick={() => onReject(friendshipId)}
                    disabled={isProcessing}
                    className="rounded-full bg-discord-bg-primary p-1.5 text-discord-red hover:bg-discord-red hover:text-white disabled:opacity-50"
                    title="Recusar"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </li>
    );
}

export default function FriendsList() {
    const [activeTab, setActiveTab] = useState("all");
    const [isAddFriendOpen, setIsAddFriendOpen] = useState(false);
    const [friends, setFriends] = useState([]);
    const [pending, setPending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [friendsRes, pendingRes] = await Promise.all([
                api.get("/api/friends"),
                api.get("/api/friends/pending")
            ]);
            setFriends(friendsRes.data ?? []);
            setPending(pendingRes.data ?? []);
        } catch (err) {
            console.error("Erro ao carregar dados de amigos:", err);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleAccept = async (id) => {
        setProcessingId(id);
        try {
            await api.post(`/api/friends/${id}/accept`);
            await fetchData();
        } catch (err) {
            console.error("Erro ao aceitar pedido:", err);
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (id) => {
        setProcessingId(id);
        try {
            await api.delete(`/api/friends/${id}/reject`);
            await fetchData();
        } catch (err) {
            console.error("Erro ao recusar pedido:", err);
        } finally {
            setProcessingId(null);
        }
    };

    let content;
    if (loading) {
        content = <p className="px-2 text-sm text-discord-text-muted">Carregando...</p>;
    } else if (activeTab === "pending") {
        content =
            pending.length === 0 ? (
                <p className="px-2 text-sm text-discord-text-muted">Nenhum pedido pendente.</p>
            ) : (
                <ul className="space-y-0.5">
                    {pending.map((p) => (
                        <PendingRow
                            key={p.friendshipId}
                            friendshipId={p.friendshipId}
                            displayName={p.displayName}
                            username={p.username}
                            onAccept={handleAccept}
                            onReject={handleReject}
                            processingId={processingId}
                        />
                    ))}
                </ul>
            );
    } else {
        content =
            friends.length === 0 ? (
                <p className="px-2 text-sm text-discord-text-muted">Nenhum amigo por aqui ainda.</p>
            ) : (
                <ul className="space-y-0.5">
                    {friends.map((f) => (
                        <FriendRow
                            key={f.friendshipId}
                            displayName={f.displayName}
                            username={f.username}
                        />
                    ))}
                </ul>
            );
    }

    return (
        <div className="flex h-full flex-col">
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
                        {tab.id === "pending" && pending.length > 0 && (
                            <span className="ml-1.5 rounded-full bg-discord-red px-1.5 py-0.5 text-[10px] text-white">
                                {pending.length}
                            </span>
                        )}
                    </button>
                ))}
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2">{content}</div>

            <AddFriendModal
                isOpen={isAddFriendOpen}
                onClose={() => setIsAddFriendOpen(false)}
                onRequestSent={fetchData}
            />
        </div>
    );
}
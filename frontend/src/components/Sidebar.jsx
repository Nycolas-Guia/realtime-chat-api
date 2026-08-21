import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api, { API_BASE_URL } from "../services/api";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import FriendsList from "./FriendsList";
import SettingsModal from "./SettingsModal";

export default function Sidebar({ activeRoomId, onSelectRoom }) {
    const { user, logout } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");
    const [activeView, setActiveView] = useState("rooms"); // "rooms" | "friends"
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);

    useEffect(() => {
        api.get("/api/rooms")
            .then((response) => {
                setRooms(response.data);
                // Se o usuário acabou de logar e não tem sala ativa, entra na primeira
                if (response.data.length > 0 && !activeRoomId) {
                    onSelectRoom(response.data[0].id);
                }
            })
            .catch((err) => console.error("Erro ao carregar salas", err));

        // Dependências vazias = só faz o GET na primeira vez que a barra lateral aparece na tela
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        const token = localStorage.getItem("@chat-app:token");

        const client = new Client({
            webSocketFactory: () => new SockJS(`${API_BASE_URL}/ws-chat`),
            connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},

            debug: () => { },

            onConnect: () => {
                const privateChannel = `/topic/user/${user.email}/rooms`;

                client.subscribe(privateChannel, (frame) => {
                    try {
                        const newRoom = JSON.parse(frame.body);

                        setRooms((prevRooms) => {
                            const alreadyExists = prevRooms.some(room => room.id === newRoom.id);
                            if (alreadyExists) {
                                return prevRooms;
                            }
                            return [...prevRooms, newRoom];
                        });
                    } catch (err) {
                        console.error("Falha ao processar nova sala STOMP:", err);
                    }
                });
            }
        });

        client.activate();

        // Cleanup: encerra essa conexão caso o componente seja destruído
        return () => {
            client.deactivate();
        };
    }, []);

    async function handleCreateRoom(e) {
        e.preventDefault();
        if (!newRoomName.trim()) return;

        try {
            const response = await api.post("/api/rooms", { name: newRoomName });
            // Limpa o input
            setNewRoomName("");
            // Seleciona a nova sala criada
            onSelectRoom(response.data.id);

        } catch (err) {
            console.error("Erro ao criar sala", err);
        }
    }

    return (
        <aside className="flex h-full w-60 flex-col bg-discord-bg-secondary">
            <div className="flex h-12 items-center border-b border-discord-border px-4 shadow-sm">
                <h1 className="truncate text-base font-semibold text-white">Chat App</h1>
            </div>

            {/* Abas Salas / Amigos */}
            <div className="flex gap-1 border-b border-discord-border px-2 py-2">
                <button
                    type="button"
                    onClick={() => setActiveView("rooms")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium transition-colors ${
                        activeView === "rooms"
                            ? "bg-discord-bg-primary text-white"
                            : "text-discord-text-muted hover:bg-discord-bg-primary/60 hover:text-discord-text-normal"
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8-1.06 0-2.077-.16-3.02-.454L3 21l1.454-4.98A7.902 7.902 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    Salas
                </button>
                <button
                    type="button"
                    onClick={() => setActiveView("friends")}
                    className={`flex flex-1 items-center justify-center gap-1.5 rounded px-2 py-1.5 text-sm font-medium transition-colors ${
                        activeView === "friends"
                            ? "bg-discord-bg-primary text-white"
                            : "text-discord-text-muted hover:bg-discord-bg-primary/60 hover:text-discord-text-normal"
                    }`}
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m6-5.13a4 4 0 11-8 0 4 4 0 018 0zm6 3a4 4 0 10-8 0" />
                    </svg>
                    Amigos
                </button>
            </div>

            {activeView === "rooms" ? (
                <nav className="flex-1 overflow-y-auto px-2 py-3">
                    <p className="mb-1 px-2 text-xs font-semibold uppercase tracking-wide text-discord-text-muted">
                        Salas de texto
                    </p>

                    <ul className="mb-4 space-y-0.5">
                        {rooms.map((room) => {
                            const isActive = room.id === activeRoomId;
                            return (
                                <li key={room.id}>
                                    <button
                                        type="button"
                                        onClick={() => onSelectRoom(room.id)}
                                        className={`group flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm font-medium transition-colors ${
                                            isActive
                                                ? "bg-discord-bg-primary text-white"
                                                : "text-discord-text-muted hover:bg-discord-bg-primary/60 hover:text-discord-text-normal"
                                        }`}
                                    >
                                        <span className="text-lg leading-none text-discord-text-muted group-hover:text-discord-text-normal">#</span>
                                        <span className="truncate">{room.name}</span>
                                    </button>
                                </li>
                            );
                        })}
                    </ul>

                    {/* Input para criar sala */}
                    <form onSubmit={handleCreateRoom} className="px-2">
                        <input
                            type="text"
                            value={newRoomName}
                            onChange={(e) => setNewRoomName(e.target.value)}
                            placeholder="+ Nova Sala (Enter)"
                            className="w-full rounded bg-discord-bg-primary px-2 py-1.5 text-sm text-discord-text-normal placeholder-discord-text-muted outline-none"
                        />
                    </form>
                </nav>
            ) : (
                <div className="flex-1 overflow-hidden">
                    <FriendsList />
                </div>
            )}

            {/* Perfil do Usuário no rodapé */}
            <div className="flex items-center gap-2 bg-discord-bg-tertiary/60 p-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-discord-blurple text-sm font-semibold text-white">
                    {user?.email?.charAt(0)?.toUpperCase() ?? "?"}
                </div>
                <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                        {user?.email?.split('@')[0] ?? "Usuário"}
                    </p>
                    <p className="truncate text-xs text-discord-text-muted">Online</p>
                </div>
                <button
                    type="button"
                    onClick={() => setIsSettingsOpen(true)}
                    className="rounded p-1.5 text-discord-text-muted hover:bg-discord-bg-primary hover:text-discord-text-normal"
                    title="Configurações do Usuário"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </button>
                <button onClick={logout} className="rounded p-1.5 text-discord-text-muted hover:bg-discord-bg-primary hover:text-discord-red" title="Sair">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>

            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </aside>
    );
}

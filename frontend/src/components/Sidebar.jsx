import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../services/api";

export default function Sidebar({ activeRoomId, onSelectRoom }) {
    const { user, logout } = useAuth();
    const [rooms, setRooms] = useState([]);
    const [newRoomName, setNewRoomName] = useState("");

    useEffect(() => {
        api.get("/api/rooms")
            .then((response) => {
                setRooms(response.data);
                if (response.data.length > 0 && !activeRoomId) {
                    onSelectRoom(response.data[0].id);
                }
            })
            .catch((err) => console.error("Erro ao carregar salas", err));
    }, [activeRoomId, onSelectRoom]);

    async function handleCreateRoom(e) {
        e.preventDefault();
        if (!newRoomName.trim()) return;
        try {
            const response = await api.post("/api/rooms", { name: newRoomName });
            setRooms((prev) => [...prev, response.data]);
            setNewRoomName("");
            onSelectRoom(response.data.id); // Já entra na sala criada
        } catch (err) {
            console.error("Erro ao criar sala", err);
        }
    }

    return (
        <aside className="flex h-full w-60 flex-col bg-discord-bg-secondary">
            <div className="flex h-12 items-center border-b border-discord-border px-4 shadow-sm">
                <h1 className="truncate text-base font-semibold text-white">Chat App</h1>
            </div>

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
                <button onClick={logout} className="rounded p-1.5 text-discord-text-muted hover:bg-discord-bg-primary hover:text-discord-red">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </button>
            </div>
        </aside>
    );
}
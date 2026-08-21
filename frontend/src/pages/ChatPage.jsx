import { useState, useEffect, useRef, useCallback } from "react";
import Sidebar from "../components/Sidebar";
import ChatBubble from "../components/ChatBubble";
import InputBar from "../components/InputBar";
import InviteMemberModal from "../components/InviteMemberModal";
import { useAuth } from "../context/AuthContext";
import { useWebSocket } from "../hooks/useWebSocket";
import api from "../services/api";


function formatTime(timestamp) {
    const date = timestamp ? new Date(timestamp) : new Date();
    return date.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function ChatPage() {
    const { user } = useAuth();

    const [activeRoomId, setActiveRoomId] = useState(null);
    const [history, setHistory] = useState([]);
    const [loadingHistory, setLoadingHistory] = useState(true);
    const [isInviteOpen, setIsInviteOpen] = useState(false);

    const { messages: realtimeMessages, connected } = useWebSocket(activeRoomId);
    const messagesEndRef = useRef(null);


    // Busca o histórico sempre que a sala ativa mudar
    useEffect(() => {
        if (!activeRoomId) return;

        let ignore = false;

        async function fetchHistory() {
            setLoadingHistory(true);
            try {
                const response = await api.get(`/api/messages/${activeRoomId}`);
                if (!ignore) setHistory(response.data ?? []);
            } catch (err) {
                console.error("Erro ao buscar histórico de mensagens:", err);
                if (!ignore) setHistory([]);
            } finally {
                if (!ignore) setLoadingHistory(false);
            }
        }

        fetchHistory();

        return () => {
            ignore = true; // evita setState em componente já desmontado/trocado
        };
    }, [activeRoomId]);

    // Histórico (REST) + mensagens novas (STOMP) combinados
    const allMessages = [...history, ...realtimeMessages];

    // Scroll automático para a última mensagem
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [allMessages.length]);

    const handleSendMessage = useCallback(
        async (text) => {
            try {
                await api.post("/api/messages", {
                    content: text,
                    roomId: activeRoomId,
                });
            } catch (err) {
                console.error("Erro ao enviar mensagem:", err);
            }
        },
        [activeRoomId, user]
    );

    return (
        <div className="flex h-screen w-screen overflow-hidden bg-discord-bg-primary">
            <Sidebar activeRoomId={activeRoomId} onSelectRoom={setActiveRoomId} />

            <main className="flex flex-1 flex-col">
                {/* Header da sala ativa */}
                <header className="flex h-12 shrink-0 items-center gap-2 border-b border-discord-border px-4 shadow-sm">
                    <span className="text-lg text-discord-text-muted">#</span>
                    <h2 className="font-semibold text-white">{activeRoomId}</h2>

                    <button
                        type="button"
                        onClick={() => setIsInviteOpen(true)}
                        disabled={!activeRoomId}
                        className="ml-4 flex items-center gap-1.5 rounded px-2 py-1 text-xs font-medium text-discord-text-muted hover:bg-discord-bg-input hover:text-discord-text-normal disabled:cursor-not-allowed disabled:opacity-50"
                        title="Convidar Membro"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-7a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                        Convidar
                    </button>

                    <span
                        className={`ml-auto flex items-center gap-1.5 text-xs ${
                            connected ? "text-discord-green" : "text-discord-text-muted"
                        }`}
                    >
            <span
                className={`h-2 w-2 rounded-full ${
                    connected ? "bg-discord-green" : "bg-discord-text-muted"
                }`}
            />
                        {connected ? "Conectado" : "Conectando..."}
          </span>
                </header>

                {/* Histórico de mensagens */}
                <div className="flex-1 overflow-y-auto py-4">
                    {loadingHistory ? (
                        <p className="px-4 text-sm text-discord-text-muted">
                            Carregando mensagens...
                        </p>
                    ) : allMessages.length === 0 ? (
                        <p className="px-4 text-sm text-discord-text-muted">
                            Nenhuma mensagem ainda. Seja o primeiro a dizer algo! 👋
                        </p>
                    ) : (
                        allMessages.map((msg, index) => {
                            const prevMsg = allMessages[index - 1];
                            const isGrouped = prevMsg?.senderName === msg.senderName;

                            return (
                                <ChatBubble
                                    key={msg.id ?? `${msg.senderName}-${index}`}
                                    sender={msg.senderName}
                                    time={formatTime(msg.timestamp)}
                                    text={msg.content}
                                    isOwnMessage={msg.senderName === user?.email}
                                    isGrouped={isGrouped}
                                />
                            );
                        })
                    )}

                    {/* Âncora invisível usada para o scroll automático */}
                    <div ref={messagesEndRef} />
                </div>

                {/* Barra de input */}
                <InputBar
                    roomName={activeRoomId}
                    onSend={handleSendMessage}
                    disabled={!connected}
                />
            </main>

            <InviteMemberModal
                isOpen={isInviteOpen}
                onClose={() => setIsInviteOpen(false)}
                roomName={activeRoomId}
            />
        </div>
    );
}

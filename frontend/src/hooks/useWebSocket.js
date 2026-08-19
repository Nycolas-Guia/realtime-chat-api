import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { API_BASE_URL } from "../services/api";

const WS_ENDPOINT = `${API_BASE_URL}/ws-chat`;

export function useWebSocket(roomId) {
    const [messages, setMessages] = useState([]);
    const [connected, setConnected] = useState(false);

    const clientRef = useRef(null);
    const subscriptionRef = useRef(null);

    useEffect(() => {
        // Limpa as mensagens em tempo real ao trocar de sala.
        setMessages([]);

        if (!roomId) return;

        const token = localStorage.getItem("@chat-app:token");

        const client = new Client({
            webSocketFactory: () => new SockJS(WS_ENDPOINT),
            connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
            reconnectDelay: 5000, // tenta reconectar sozinho a cada 5s
            debug: () => {}, // silencia os logs verbosos do STOMP

            onConnect: () => {
                setConnected(true);

                subscriptionRef.current = client.subscribe(
                    `/topic/room/${roomId}`,
                    (frame) => {
                        try {
                            const receivedMessage = JSON.parse(frame.body);
                            setMessages((prev) => [...prev, receivedMessage]);
                        } catch (err) {
                            console.error("Falha ao parsear mensagem STOMP:", err);
                        }
                    }
                );
            },

            onWebSocketClose: () => {
                setConnected(false);
            },

            onStompError: (frame) => {
                console.error("Erro STOMP:", frame.headers?.message, frame.body);
            },
        });

        client.activate();
        clientRef.current = client;

        // Cleanup: roda ao trocar de sala OU ao desmontar o componente
        return () => {
            subscriptionRef.current?.unsubscribe();
            client.deactivate();
            clientRef.current = null;
            setConnected(false);
        };
    }, [roomId]);

    return { messages, connected };
}
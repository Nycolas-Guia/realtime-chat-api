package com.nycolas.realtime_chat_api.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "tb_messages")
public class Message {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false, columnDefinition = "TEXT")
    private String content;

    private LocalDateTime timestamp = LocalDateTime.now();

    /**
     * Relacionamento Muitos-para-Um: Muitas mensagens podem ser enviadas por UM único usuário.
     * O JoinColumn cria a Chave Estrangeira 'sender_id' na tabela de mensagens.
     */
    @ManyToOne
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    /**
     * Relacionamento Muitos-para-Um: Muitas mensagens podem pertencer a UMA única sala.
     * O JoinColumn cria a Chave Estrangeira 'chat_room_id' na tabela de mensagens.
     */
    @ManyToOne
    @JoinColumn(name = "chat_room_id", nullable = false)
    private ChatRoom room;

    // ==========================================
    // GETTERS E SETTERS
    // ==========================================
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getTimestamp() { return timestamp; }
    public void setTimestamp(LocalDateTime timestamp) { this.timestamp = timestamp; }

    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }

    public ChatRoom getRoom() { return room; }
    public void setRoom(ChatRoom room) { this.room = room; }
}
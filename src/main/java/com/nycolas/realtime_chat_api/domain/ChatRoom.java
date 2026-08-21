package com.nycolas.realtime_chat_api.domain;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;
import java.util.UUID;

@Entity
@Table(name = "tb_chat_rooms")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @Column(nullable = false)
    private String name;

    // Define se é um chat privado 1x1 (true) ou um grupo (false)
    @Column(nullable = false)
    private boolean isDirectMessage = false;

    private LocalDateTime createdAt = LocalDateTime.now();

    // Cria a tabela intermediária que liga os Usuários às Salas
    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "tb_chat_room_members",
            joinColumns = @JoinColumn(name = "room_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private Set<User> members = new HashSet<>();

    // ==========================================
    // GETTERS E SETTERS
    // ==========================================
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public boolean isDirectMessage() { return isDirectMessage; }
    public void setDirectMessage(boolean directMessage) { isDirectMessage = directMessage; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public Set<User> getMembers() { return members; }
    public void setMembers(Set<User> members) { this.members = members; }
}
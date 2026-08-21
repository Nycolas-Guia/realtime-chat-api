package com.nycolas.realtime_chat_api.repository;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {

    // Busca apenas as salas onde o e-mail do membro bate com o e-mail logado
    @Query("SELECT r FROM ChatRoom r JOIN r.members m WHERE m.email = :email")
    List<ChatRoom> findRoomsByUserEmail(@Param("email") String email);
}
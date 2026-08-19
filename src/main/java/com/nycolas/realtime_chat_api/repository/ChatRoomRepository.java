package com.nycolas.realtime_chat_api.repository;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;
import java.util.UUID;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, UUID> {


}
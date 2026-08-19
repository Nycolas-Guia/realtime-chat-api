package com.nycolas.realtime_chat_api.dto;

import com.nycolas.realtime_chat_api.domain.ChatRoom;

import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO responsável por formatar a saída dos dados de uma sala.
 * Protege a Entidade original e entrega apenas as informações necessárias para o frontend.
 */
public record ChatRoomResponseDTO(
        UUID id,
        String name,
        LocalDateTime createdAt
) {
    // Construtor utilitário para converter rapidamente a Entidade em DTO
    public ChatRoomResponseDTO(ChatRoom chatRoom) {
        this(
                chatRoom.getId(),
                chatRoom.getName(),
                chatRoom.getCreatedAt()
        );
    }
}
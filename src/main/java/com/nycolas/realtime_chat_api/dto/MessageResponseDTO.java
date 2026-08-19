package com.nycolas.realtime_chat_api.dto;

import com.nycolas.realtime_chat_api.domain.Message;
import java.time.LocalDateTime;
import java.util.UUID;

/**
 * DTO para envio das mensagens ao frontend.
 * Expõe apenas o nome do remetente, protegendo o resto dos dados do usuário.
 */
public record MessageResponseDTO(
        UUID id,
        String content,
        LocalDateTime timestamp,
        String senderName,
        UUID roomId
) {
    public MessageResponseDTO(Message message) {
        this(
                message.getId(),
                message.getContent(),
                message.getTimestamp(),
                message.getSender().getRealUsername(),
                message.getRoom().getId()
        );
    }
}
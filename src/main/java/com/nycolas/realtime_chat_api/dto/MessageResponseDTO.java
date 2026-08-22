package com.nycolas.realtime_chat_api.dto;

import com.nycolas.realtime_chat_api.domain.Message;
import java.time.LocalDateTime;
import java.util.UUID;

public record MessageResponseDTO(
        UUID id,
        String content,
        String senderEmail,
        String senderDisplayName,
        LocalDateTime timestamp
) {
    public MessageResponseDTO(Message message) {
        this(
                message.getId(),
                message.getContent(),
                message.getSender().getEmail(),

                // LÓGICA DE EXIBIÇÃO: Tem apelido? Usa ele. Não tem? Usa o username.
                (message.getSender().getDisplayName() != null && !message.getSender().getDisplayName().trim().isEmpty())
                        ? message.getSender().getDisplayName()
                        : message.getSender().getAppUsername(),

                message.getTimestamp()
        );
    }
}
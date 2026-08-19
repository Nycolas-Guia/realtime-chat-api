package com.nycolas.realtime_chat_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.UUID;

/**
 * DTO para recebimento de uma nova mensagem.
 * NÃO pedimos os dados do remetente aqui, por questões de segurança.
 */
public record MessageRequestDTO(
        @NotBlank(message = "O conteúdo da mensagem não pode estar vazio")
        String content,

        @NotNull(message = "O ID da sala é obrigatório")
        UUID roomId
) {
}
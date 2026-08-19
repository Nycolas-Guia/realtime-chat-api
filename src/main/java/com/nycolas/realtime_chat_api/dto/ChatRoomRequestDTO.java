package com.nycolas.realtime_chat_api.dto;

import jakarta.validation.constraints.NotBlank;

/**
 * DTO responsável por receber os dados necessários para a criação de uma nova sala.
 */
public record ChatRoomRequestDTO(
        @NotBlank(message = "O nome da sala é obrigatório")
        String name
) {
}
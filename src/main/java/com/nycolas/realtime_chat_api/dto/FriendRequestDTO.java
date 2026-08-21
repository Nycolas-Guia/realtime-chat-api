package com.nycolas.realtime_chat_api.dto;

import jakarta.validation.constraints.NotBlank;

public record FriendRequestDTO(
        @NotBlank(message = "O username é obrigatório")
        String username
) {
}
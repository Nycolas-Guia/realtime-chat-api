package com.nycolas.realtime_chat_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InviteMemberRequestDTO(
        @NotBlank(message = "O nome de usuário é obrigatório")
        String username
) {
}
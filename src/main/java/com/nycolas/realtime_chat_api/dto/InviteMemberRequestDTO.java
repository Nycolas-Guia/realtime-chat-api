package com.nycolas.realtime_chat_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record InviteMemberRequestDTO(
        @NotBlank(message = "O e-mail não pode estar vazio")
        @Email(message = "Formato de e-mail inválido")
        String email
) {
}
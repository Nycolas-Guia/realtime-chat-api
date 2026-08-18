package com.nycolas.realtime_chat_api.dto;

import com.nycolas.realtime_chat_api.domain.User;
import java.util.UUID;

public record UserResponseDTO(
        UUID id,
        String username,
        String email
) {

    public UserResponseDTO(User user) {
        this(user.getId(), user.getUsername(), user.getEmail());
    }
}
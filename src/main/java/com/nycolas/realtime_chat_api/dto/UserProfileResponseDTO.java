package com.nycolas.realtime_chat_api.dto;

import com.nycolas.realtime_chat_api.domain.User;
import java.util.UUID;

public record UserProfileResponseDTO(
        UUID id,
        String email,
        String username,
        String displayName
) {
    public UserProfileResponseDTO(User user) {
        this(
                user.getId(),
                user.getEmail(),
                user.getAppUsername(),
                user.getDisplayName()
        );
    }
}
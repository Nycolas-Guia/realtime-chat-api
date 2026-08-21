package com.nycolas.realtime_chat_api.dto;

import java.util.UUID;

public record FriendResponseDTO(
        UUID friendshipId,
        String username,
        String displayName,
        String status
) {
}
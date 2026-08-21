package com.nycolas.realtime_chat_api.dto;

public record UserSettingsRequestDTO(
        String displayName,
        String currentPassword,
        String newPassword
) {
}
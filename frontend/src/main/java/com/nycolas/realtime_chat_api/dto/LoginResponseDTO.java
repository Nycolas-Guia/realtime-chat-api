package com.nycolas.realtime_chat_api.dto;

/**
 * DTO responsável por retornar o Token JWT após uma autenticação bem-sucedida.
 */
public record LoginResponseDTO(
        String token
) {
}
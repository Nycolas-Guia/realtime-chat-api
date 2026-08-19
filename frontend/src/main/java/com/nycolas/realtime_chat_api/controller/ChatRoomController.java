package com.nycolas.realtime_chat_api.controller;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import com.nycolas.realtime_chat_api.dto.ChatRoomRequestDTO;
import com.nycolas.realtime_chat_api.dto.ChatRoomResponseDTO;
import com.nycolas.realtime_chat_api.service.ChatRoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/rooms")
public class ChatRoomController {

    private final ChatRoomService chatRoomService;

    public ChatRoomController(ChatRoomService chatRoomService) {
        this.chatRoomService = chatRoomService;
    }

    /**
     * Endpoint para criação de uma nova sala de chat.
     * Requer autenticação
     */
    @PostMapping
    public ResponseEntity<ChatRoomResponseDTO> createRoom(@RequestBody @Valid ChatRoomRequestDTO request) {
        ChatRoom newRoom = chatRoomService.createRoom(request.name());

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ChatRoomResponseDTO(newRoom));
    }

    /**
     * Endpoint para listagem de todas as salas disponíveis.
     * Converte a lista de entidades para uma lista de DTOs antes de retornar.
     * Requer autenticação
     */
    @GetMapping
    public ResponseEntity<List<ChatRoomResponseDTO>> getAllRooms() {
        List<ChatRoomResponseDTO> rooms = chatRoomService.getAllRooms().stream()
                .map(ChatRoomResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(rooms);
    }
}
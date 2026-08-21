package com.nycolas.realtime_chat_api.controller;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import com.nycolas.realtime_chat_api.dto.ChatRoomRequestDTO;
import com.nycolas.realtime_chat_api.dto.ChatRoomResponseDTO;
import com.nycolas.realtime_chat_api.dto.InviteMemberRequestDTO;
import com.nycolas.realtime_chat_api.service.ChatRoomService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
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
     * Captura automaticamente o e-mail do usuário autenticado.
     */
    @PostMapping
    public ResponseEntity<ChatRoomResponseDTO> createRoom(
            @RequestBody @Valid ChatRoomRequestDTO request,
            Authentication authentication) {

        // Pega o e-mail/username do usuário que está fazendo a requisição via Token JWT
        String creatorEmail = authentication.getName();

        // Passa o nome da sala E o e-mail do criador para o Service
        ChatRoom newRoom = chatRoomService.createRoom(request.name(), creatorEmail);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new ChatRoomResponseDTO(newRoom));
    }

    /**
     * Endpoint para listagem de todas as salas disponíveis.
     * Converte a lista de entidades para uma lista de DTOs antes de retornar.
     */
    @GetMapping
    public ResponseEntity<List<ChatRoomResponseDTO>> getUserRooms(Authentication authentication) {
        String userEmail = authentication.getName(); // Pega o e-mail do token

        List<ChatRoomResponseDTO> rooms = chatRoomService.getUserRooms(userEmail).stream()
                .map(ChatRoomResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(rooms);
    }

    /**
     * Endpoint para adicionar um membro a uma sala existente.
     * Rota: POST /api/rooms/{roomId}/members
     */
    @PostMapping("/{roomId}/members")
    public ResponseEntity<Void> addMember(
            @PathVariable UUID roomId,
            @RequestBody @Valid InviteMemberRequestDTO request) {

        chatRoomService.addMember(roomId, request.username().toLowerCase());

        return ResponseEntity.ok().build();
    }
}
package com.nycolas.realtime_chat_api.controller;

import com.nycolas.realtime_chat_api.dto.MessageRequestDTO;
import com.nycolas.realtime_chat_api.dto.MessageResponseDTO;
import com.nycolas.realtime_chat_api.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private final MessageService messageService;

    public MessageController(MessageService messageService) {
        this.messageService = messageService;
    }

    /**
     * Endpoint para envio de uma nova mensagem para uma sala específica.
     * O autor da mensagem é extraído de forma segura diretamente do contexto de
     * segurança do Spring (Token JWT), impedindo falsidade ideológica na API.
     */
    @PostMapping
    public ResponseEntity<MessageResponseDTO> sendMessage(
            @RequestBody @Valid MessageRequestDTO request,
            Authentication authentication // O Spring injeta automaticamente o usuário logado aqui!
    ) {
        // Como no nosso contrato UserDetails nós definimos que o Username é o e-mail,
        // o getName() nos devolverá exatamente o e-mail extraído do Token JWT.
        String senderEmail = authentication.getName();

        var newMessage = messageService.sendMessage(request, senderEmail);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(new MessageResponseDTO(newMessage));
    }

    /**
     * Endpoint para buscar o histórico completo e ordenado de mensagens de uma sala.
     */
    @GetMapping("/{roomId}")
    public ResponseEntity<List<MessageResponseDTO>> getRoomHistory(@PathVariable UUID roomId) {
        List<MessageResponseDTO> history = messageService.getRoomHistory(roomId).stream()
                .map(MessageResponseDTO::new)
                .collect(Collectors.toList());

        return ResponseEntity.ok(history);
    }
}
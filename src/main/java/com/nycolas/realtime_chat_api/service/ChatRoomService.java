package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import com.nycolas.realtime_chat_api.dto.ChatRoomResponseDTO;
import com.nycolas.realtime_chat_api.repository.ChatRoomRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    private final SimpMessagingTemplate messagingTemplate;

    public ChatRoomService(ChatRoomRepository chatRoomRepository, SimpMessagingTemplate messagingTemplate) {
        this.chatRoomRepository = chatRoomRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Cria uma nova sala no banco de dados e notifica todos os usuários conectados.
     */
    public ChatRoom createRoom(String name) {
        ChatRoom newRoom = new ChatRoom();
        newRoom.setName(name);

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);
        ChatRoomResponseDTO responseDTO = new ChatRoomResponseDTO(savedRoom);
        messagingTemplate.convertAndSend("/topic/rooms", responseDTO);

        return savedRoom;
    }

    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }
}
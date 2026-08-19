package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import com.nycolas.realtime_chat_api.domain.Message;
import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.MessageRequestDTO;
import com.nycolas.realtime_chat_api.dto.MessageResponseDTO;
import com.nycolas.realtime_chat_api.repository.ChatRoomRepository;
import com.nycolas.realtime_chat_api.repository.MessageRepository;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    private final SimpMessagingTemplate messagingTemplate;

    public MessageService(MessageRepository messageRepository,
                          ChatRoomRepository chatRoomRepository,
                          UserRepository userRepository,
                          SimpMessagingTemplate messagingTemplate) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * Cria, salva e DISTRIBUI a mensagem em tempo real.
     */
    public Message sendMessage(MessageRequestDTO request, String senderEmail) {
        User sender = (User) userRepository.findByEmail(senderEmail);
        ChatRoom room = chatRoomRepository.findById(request.roomId())
                .orElseThrow(() -> new IllegalArgumentException("Sala de chat não encontrada."));

        Message message = new Message();
        message.setContent(request.content());
        message.setSender(sender);
        message.setRoom(room);
        Message savedMessage = messageRepository.save(message);

        MessageResponseDTO responsePayload = new MessageResponseDTO(savedMessage);
        messagingTemplate.convertAndSend("/topic/room/" + room.getId(), responsePayload);

        return savedMessage;
    }

    public List<Message> getRoomHistory(UUID roomId) {
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId);
    }
}
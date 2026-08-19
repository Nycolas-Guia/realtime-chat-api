package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import com.nycolas.realtime_chat_api.domain.Message;
import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.MessageRequestDTO;
import com.nycolas.realtime_chat_api.repository.ChatRoomRepository;
import com.nycolas.realtime_chat_api.repository.MessageRepository;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MessageService {

    private final MessageRepository messageRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final UserRepository userRepository;

    public MessageService(MessageRepository messageRepository,
                          ChatRoomRepository chatRoomRepository,
                          UserRepository userRepository) {
        this.messageRepository = messageRepository;
        this.chatRoomRepository = chatRoomRepository;
        this.userRepository = userRepository;
    }

    /**
     * Cria e persiste uma nova mensagem no banco de dados.
     */
    public Message sendMessage(MessageRequestDTO request, String senderEmail) {
        // 1. Busca o usuário real baseado no token
        User sender = (User) userRepository.findByEmail(senderEmail);

        // 2. Busca a sala. Se não existir, lança um erro 404 (Not Found)
        ChatRoom room = chatRoomRepository.findById(request.roomId())
                .orElseThrow(() -> new IllegalArgumentException("Sala de chat não encontrada."));

        // 3. Monta a mensagem e salva no banco
        Message message = new Message();
        message.setContent(request.content());
        message.setSender(sender);
        message.setRoom(room);

        return messageRepository.save(message);
    }

    /**
     * Busca o histórico de mensagens de uma sala, já ordenado por data/hora.
     */
    public List<Message> getRoomHistory(UUID roomId) {
        return messageRepository.findByRoomIdOrderByTimestampAsc(roomId);
    }
}
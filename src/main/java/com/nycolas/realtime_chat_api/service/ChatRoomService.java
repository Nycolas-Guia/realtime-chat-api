package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.ChatRoomResponseDTO;
import com.nycolas.realtime_chat_api.repository.ChatRoomRepository;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final UserRepository userRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository,
                           SimpMessagingTemplate messagingTemplate,
                           UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.messagingTemplate = messagingTemplate;
        this.userRepository = userRepository;
    }

    /**
     * Cria uma nova sala e vincula o criador como o primeiro membro.
     */
    public ChatRoom createRoom(String name, String creatorEmail) {
        UserDetails userDetails = userRepository.findByEmail(creatorEmail);
        if (userDetails == null) {
            throw new IllegalArgumentException("Usuário criador não encontrado.");
        }
        User creator = (User) userDetails;

        ChatRoom newRoom = new ChatRoom();
        newRoom.setName(name);

        // Adiciona o criador à sala
        newRoom.getMembers().add(creator);

        ChatRoom savedRoom = chatRoomRepository.save(newRoom);
        ChatRoomResponseDTO responseDTO = new ChatRoomResponseDTO(savedRoom);

        messagingTemplate.convertAndSend("/topic/user/" + creatorEmail + "/rooms", responseDTO);
        return savedRoom;
    }

    /**
     * Retorna todas as salas.
     */
    public List<ChatRoom> getUserRooms(String userEmail) {
        return chatRoomRepository.findRoomsByUserEmail(userEmail);
    }

    /**
     * Adiciona um usuário existente a uma sala de chat.
     */
    @Transactional
    public void addMember(UUID roomId, String userEmail) {
        // Usa a busca com JOIN FETCH para garantir que os membros venham carregados na sessão
        ChatRoom room = chatRoomRepository.findByIdWithMembers(roomId)
                .orElseThrow(() -> new IllegalArgumentException("Sala não encontrada"));

        UserDetails userDetails = userRepository.findByEmail(userEmail);
        if (userDetails == null) {
            throw new IllegalArgumentException("Usuário com e-mail " + userEmail + " não encontrado.");
        }

        User user = (User) userDetails;

        // Adiciona o usuário na lista (agora a coleção está inicializada com sucesso!)
        room.getMembers().add(user);

        chatRoomRepository.save(room);
    }
}
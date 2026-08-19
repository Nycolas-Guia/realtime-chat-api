package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.ChatRoom;
import com.nycolas.realtime_chat_api.repository.ChatRoomRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ChatRoomService {

    private final ChatRoomRepository chatRoomRepository;

    public ChatRoomService(ChatRoomRepository chatRoomRepository) {
        this.chatRoomRepository = chatRoomRepository;
    }

    public ChatRoom createRoom(String name) {
        ChatRoom newRoom = new ChatRoom();
        newRoom.setName(name);

        return chatRoomRepository.save(newRoom);
    }

    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAll();
    }
}
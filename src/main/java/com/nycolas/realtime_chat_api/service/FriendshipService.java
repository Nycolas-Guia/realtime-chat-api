package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.Friendship;
import com.nycolas.realtime_chat_api.domain.FriendshipStatus;
import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.FriendResponseDTO;
import com.nycolas.realtime_chat_api.repository.FriendshipRepository;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class FriendshipService {

    private final FriendshipRepository friendshipRepository;
    private final UserRepository userRepository;

    public FriendshipService(FriendshipRepository friendshipRepository, UserRepository userRepository) {
        this.friendshipRepository = friendshipRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public void sendFriendRequest(String senderEmail, String receiverUsername) {
        User sender = (User) userRepository.findByEmail(senderEmail);
        User receiver = userRepository.findByUsername(receiverUsername.toLowerCase());

        if (receiver == null) {
            throw new IllegalArgumentException("Usuário @" + receiverUsername + " não encontrado.");
        }
        if (sender.getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Você não pode adicionar a si mesmo.");
        }

        // Verifica se já existe amizade ou convite pendente
        Optional<Friendship> existing = friendshipRepository.findFriendshipBetween(sender, receiver);
        if (existing.isPresent()) {
            throw new IllegalArgumentException("Já existe um convite ou amizade entre vocês.");
        }

        Friendship friendship = new Friendship(sender, receiver, FriendshipStatus.PENDING);
        friendshipRepository.save(friendship);
    }

    @Transactional
    public void acceptRequest(String userEmail, UUID friendshipId) {
        User receiver = (User) userRepository.findByEmail(userEmail);
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Convite não encontrado."));

        // Garante que só quem recebeu o convite pode aceitar
        if (!friendship.getReceiver().getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Você não tem permissão para aceitar este convite.");
        }

        friendship.setStatus(FriendshipStatus.ACCEPTED);
        friendshipRepository.save(friendship);
    }

    @Transactional
    public void rejectRequest(String userEmail, UUID friendshipId) {
        User receiver = (User) userRepository.findByEmail(userEmail);
        Friendship friendship = friendshipRepository.findById(friendshipId)
                .orElseThrow(() -> new IllegalArgumentException("Convite não encontrado."));

        if (!friendship.getReceiver().getId().equals(receiver.getId())) {
            throw new IllegalArgumentException("Você não tem permissão para recusar este convite.");
        }

        // Em vez de salvar como "REJECTED", nós deletamos para que a pessoa possa enviar convite de novo no futuro
        friendshipRepository.delete(friendship);
    }

    @Transactional(readOnly = true)
    public List<FriendResponseDTO> getPendingRequests(String userEmail) {
        User receiver = (User) userRepository.findByEmail(userEmail);
        List<Friendship> pending = friendshipRepository.findByReceiverAndStatus(receiver, FriendshipStatus.PENDING);

        // Mapeia para o DTO (mostrando os dados de quem ENVIOU o convite)
        return pending.stream().map(f -> new FriendResponseDTO(
                f.getId(),
                f.getSender().getUsername(),
                f.getSender().getDisplayName() != null ? f.getSender().getDisplayName() : f.getSender().getUsername(),
                f.getStatus().name()
        )).collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public List<FriendResponseDTO> getAcceptedFriends(String userEmail) {
        User me = (User) userRepository.findByEmail(userEmail);
        List<Friendship> friendships = friendshipRepository.findAllAcceptedFriendsByUser(me);

        return friendships.stream().map(f -> {
            // Descobre quem é o amigo (se eu sou o sender, o amigo é o receiver, e vice-versa)
            User friend = f.getSender().getId().equals(me.getId()) ? f.getReceiver() : f.getSender();
            return new FriendResponseDTO(
                    f.getId(),
                    friend.getUsername(),
                    friend.getDisplayName() != null ? friend.getDisplayName() : friend.getUsername(),
                    f.getStatus().name()
            );
        }).collect(Collectors.toList());
    }
}
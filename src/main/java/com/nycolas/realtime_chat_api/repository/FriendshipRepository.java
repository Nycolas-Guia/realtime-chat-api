package com.nycolas.realtime_chat_api.repository;

import com.nycolas.realtime_chat_api.domain.Friendship;
import com.nycolas.realtime_chat_api.domain.FriendshipStatus;
import com.nycolas.realtime_chat_api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface FriendshipRepository extends JpaRepository<Friendship, UUID> {

    // 1. Verifica se já existe ALGUMA relação entre os dois (para não deixar mandar convite duplicado)
    @Query("SELECT f FROM Friendship f WHERE (f.sender = :userA AND f.receiver = :userB) OR (f.sender = :userB AND f.receiver = :userA)")
    Optional<Friendship> findFriendshipBetween(@Param("userA") User userA, @Param("userB") User userB);

    // 2. Busca todos os convites que eu RECEBI e estão pendentes (Para a aba "Pendentes")
    List<Friendship> findByReceiverAndStatus(User receiver, FriendshipStatus status);

    // 3. Busca todas as amizades ACEITAS onde eu sou o Sender ou o Receiver (Para a aba "Todos")
    @Query("SELECT f FROM Friendship f WHERE (f.sender = :user OR f.receiver = :user) AND f.status = 'ACCEPTED'")
    List<Friendship> findAllAcceptedFriendsByUser(@Param("user") User user);
}
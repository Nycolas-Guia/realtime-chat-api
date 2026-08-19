package com.nycolas.realtime_chat_api.repository;

import com.nycolas.realtime_chat_api.domain.Message;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface MessageRepository extends JpaRepository<Message, UUID> {

    /**
     * Recupera o histórico completo de mensagens de uma sala específica.
     * A cláusula 'OrderByTimestampAsc' garante que o banco de dados faça o esforço
     * de ordenação (da mais antiga para a mais nova), aliviando o processamento do servidor Java.
     */
    List<Message> findByRoomIdOrderByTimestampAsc(UUID roomId);
}
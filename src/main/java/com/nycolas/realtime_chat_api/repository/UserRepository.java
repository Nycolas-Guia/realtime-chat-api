package com.nycolas.realtime_chat_api.repository; // Confirme o nome do seu pacote

import com.nycolas.realtime_chat_api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;

public interface UserRepository extends JpaRepository<User, UUID> {

}

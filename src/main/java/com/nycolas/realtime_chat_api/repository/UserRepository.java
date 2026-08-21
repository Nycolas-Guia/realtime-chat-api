package com.nycolas.realtime_chat_api.repository;

import com.nycolas.realtime_chat_api.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.UUID;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserRepository extends JpaRepository<User, UUID> {
    UserDetails findByEmail(String email);
    User findByUsernameIgnoreCase(String username);
}

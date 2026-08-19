package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    /**
     * Cria um novo usuário no sistema.
     * A senha recebida em texto plano é interceptada e submetida ao hash (BCrypt)
     * antes da persistência no banco de dados para garantir a segurança da credencial.
     */
    public User createUser(User user) {
        String encryptedPassword = passwordEncoder.encode(user.getPassword());
        user.setPassword(encryptedPassword);

        return userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
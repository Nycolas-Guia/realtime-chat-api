package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.UserSettingsRequestDTO;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

    @Transactional
    public void updateUserSettings(String email, UserSettingsRequestDTO data) {
        // Busca o usuário logado
        User user = (User) userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("Usuário não encontrado.");
        }

        // 1. Atualiza o Apelido (se foi enviado algum)
        if (data.displayName() != null && !data.displayName().trim().isEmpty()) {
            user.setDisplayName(data.displayName());
        }

        // 2. Atualiza a Senha (se a senha atual e a nova foram enviadas)
        if (data.currentPassword() != null && data.newPassword() != null) {
            // Verifica se a senha antiga que ele digitou está correta
            if (!passwordEncoder.matches(data.currentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("A senha atual está incorreta.");
            }
            // Criptografa e salva a nova senha
            user.setPassword(passwordEncoder.encode(data.newPassword()));
        }

        // Salva as alterações
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }
}
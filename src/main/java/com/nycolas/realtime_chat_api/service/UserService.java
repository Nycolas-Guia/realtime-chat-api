package com.nycolas.realtime_chat_api.service;

import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }
}
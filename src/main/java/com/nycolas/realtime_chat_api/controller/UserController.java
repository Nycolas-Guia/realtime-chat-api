package com.nycolas.realtime_chat_api.controller;

import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.UserProfileResponseDTO;
import com.nycolas.realtime_chat_api.dto.UserRequestDTO;
import com.nycolas.realtime_chat_api.dto.UserResponseDTO;
import com.nycolas.realtime_chat_api.dto.UserSettingsRequestDTO;
import com.nycolas.realtime_chat_api.repository.UserRepository;
import com.nycolas.realtime_chat_api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;


import java.util.List;
import java.util.Locale;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    public UserController(UserService userService, UserRepository userRepository) {
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO request) {

        User newUser = new User();
        newUser.setUsername(request.username().toLowerCase());
        newUser.setEmail(request.email().toLowerCase());
        newUser.setPassword(request.password());

        User createdUser = userService.createUser(newUser);
        UserResponseDTO response = new UserResponseDTO(createdUser);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    @GetMapping
    public ResponseEntity<List<UserResponseDTO>> getAllUsers() {
        List<User> users = userService.getAllUsers();

        List<UserResponseDTO> responseList = users.stream()
                .map(UserResponseDTO::new)
                .toList();

        return ResponseEntity.ok(responseList);
    }

    @GetMapping("/me")
    public ResponseEntity<UserProfileResponseDTO> getMyProfile(Authentication authentication) {
        // Pega o e-mail do token JWT
        String email = authentication.getName();

        // Busca no banco e faz o cast de UserDetails para User
        User user = (User) userRepository.findByEmail(email);

        if (user == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(new UserProfileResponseDTO(user));
    }


    @PutMapping("/me")
    public ResponseEntity<Void> updateSettings(
            @RequestBody UserSettingsRequestDTO request,
            Authentication authentication) {

        // Pega o e-mail do usuário pelo token JWT
        String userEmail = authentication.getName();

        // Repassa para o Service processar
        userService.updateUserSettings(userEmail, request);

        return ResponseEntity.ok().build();
    }
}
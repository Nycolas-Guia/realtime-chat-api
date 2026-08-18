package com.nycolas.realtime_chat_api.controller;

import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.UserRequestDTO;
import com.nycolas.realtime_chat_api.dto.UserResponseDTO;
import com.nycolas.realtime_chat_api.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping
    public ResponseEntity<UserResponseDTO> createUser(@Valid @RequestBody UserRequestDTO request) {

        User newUser = new User();
        newUser.setUsername(request.username());
        newUser.setEmail(request.email());
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
}
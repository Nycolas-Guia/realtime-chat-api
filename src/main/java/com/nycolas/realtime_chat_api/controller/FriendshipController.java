package com.nycolas.realtime_chat_api.controller;

import com.nycolas.realtime_chat_api.dto.FriendResponseDTO;
import com.nycolas.realtime_chat_api.dto.FriendRequestDTO;
import com.nycolas.realtime_chat_api.service.FriendshipService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/friends")
public class FriendshipController {

    private final FriendshipService friendshipService;

    public FriendshipController(FriendshipService friendshipService) {
        this.friendshipService = friendshipService;
    }

    @PostMapping("/request")
    public ResponseEntity<Void> sendRequest(@RequestBody @Valid FriendRequestDTO request, Authentication auth) {
        friendshipService.sendFriendRequest(auth.getName(), request.username());
        return ResponseEntity.ok().build();
    }

    @PostMapping("/{id}/accept")
    public ResponseEntity<Void> acceptRequest(@PathVariable UUID id, Authentication auth) {
        friendshipService.acceptRequest(auth.getName(), id);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{id}/reject")
    public ResponseEntity<Void> rejectRequest(@PathVariable UUID id, Authentication auth) {
        friendshipService.rejectRequest(auth.getName(), id);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending")
    public ResponseEntity<List<FriendResponseDTO>> getPendingRequests(Authentication auth) {
        return ResponseEntity.ok(friendshipService.getPendingRequests(auth.getName()));
    }

    @GetMapping
    public ResponseEntity<List<FriendResponseDTO>> getAcceptedFriends(Authentication auth) {
        return ResponseEntity.ok(friendshipService.getAcceptedFriends(auth.getName()));
    }
}
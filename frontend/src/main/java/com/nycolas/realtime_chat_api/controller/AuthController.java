package com.nycolas.realtime_chat_api.controller;

import com.nycolas.realtime_chat_api.domain.User;
import com.nycolas.realtime_chat_api.dto.LoginRequestDTO;
import com.nycolas.realtime_chat_api.dto.LoginResponseDTO;
import com.nycolas.realtime_chat_api.service.TokenService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final TokenService tokenService;

    public AuthController(AuthenticationManager authenticationManager, TokenService tokenService) {
        this.authenticationManager = authenticationManager;
        this.tokenService = tokenService;
    }

    /**
     * Endpoint público para autenticação de usuários.
     * Recebe as credenciais, valida via AuthenticationManager e, em caso de sucesso,
     * emite um Token JWT para uso nas requisições subsequentes.
     */
    @PostMapping("/login")
    public ResponseEntity<LoginResponseDTO> login(@RequestBody @Valid LoginRequestDTO request) {
        // 1. Encapsula as credenciais recebidas no padrão que o Spring Security entende
        var usernamePassword = new UsernamePasswordAuthenticationToken(request.email(), request.password());

        // 2. Dispara o processo de validação (compara senhas, checa se existe, etc)
        var auth = this.authenticationManager.authenticate(usernamePassword);

        // 3. Caso a validação passe, gera o Token JWT extraindo a entidade User do contexto de autenticação
        var token = tokenService.generateToken((User) auth.getPrincipal());

        // 4. Retorna o token envelopado no nosso DTO de resposta
        return ResponseEntity.ok(new LoginResponseDTO(token));
    }
}
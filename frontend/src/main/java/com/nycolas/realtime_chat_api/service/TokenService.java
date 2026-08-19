package com.nycolas.realtime_chat_api.service;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.nycolas.realtime_chat_api.domain.User;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    // O Spring vai buscar automaticamente o valor que colocamos no application.properties
    @Value("${api.security.token.secret}")
    private String secret;

    /**
     * Gera um Token JWT para o usuário autenticado.
     * Define o emissor (issuer), o sujeito (e-mail do usuário) e a data de expiração.
     */
    public String generateToken(User user) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.create()
                    .withIssuer("realtime-chat-api")
                    .withSubject(user.getEmail())
                    .withExpiresAt(generateExpirationDate())
                    .sign(algorithm);
        } catch (JWTCreationException exception) {
            throw new RuntimeException("Erro durante a geração do token JWT", exception);
        }
    }

    /**
     * Descriptografa e valida o Token JWT.
     * Retorna o e-mail do usuário (subject) se o token for válido e não estiver expirado.
     */
    public String validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);
            return JWT.require(algorithm)
                    .withIssuer("realtime-chat-api")
                    .build()
                    .verify(token)
                    .getSubject();
        } catch (JWTVerificationException exception) {
            return ""; // Retorna string vazia se o token for inválido ou expirado
        }
    }

    /**
     * Define o tempo de validade do Token (ex: 2 horas a partir da geração).
     * Utiliza o fuso horário de Brasília (-03:00).
     */
    private Instant generateExpirationDate() {
        return LocalDateTime.now().plusHours(2).toInstant(ZoneOffset.of("-03:00"));
    }
}
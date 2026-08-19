package com.nycolas.realtime_chat_api.config;

import com.nycolas.realtime_chat_api.repository.UserRepository;
import com.nycolas.realtime_chat_api.service.TokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class SecurityFilter extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UserRepository userRepository;

    public SecurityFilter(TokenService tokenService, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userRepository = userRepository;
    }

    /**
     * Intercepta a requisição, extrai o token JWT (se existir), valida e insere
     * o contexto de autenticação no Spring Security para aquela transação específica.
     */
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
        var token = this.recoverToken(request);

        if (token != null) {
            var email = tokenService.validateToken(token);

            if (!email.isEmpty()) {
                UserDetails user = userRepository.findByEmail(email);

                // Cria o objeto de autenticação e insere no contexto de segurança da requisição
                var authentication = new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        }

        // A cancela é aberta e a requisição continua seu fluxo
        filterChain.doFilter(request, response);
    }

    /**
     * Recupera o token do cabeçalho 'Authorization'.
     * O padrão HTTP exige o formato "Bearer <token>".
     */
    private String recoverToken(HttpServletRequest request) {
        var authHeader = request.getHeader("Authorization");
        if (authHeader == null) return null;

        // Remove a palavra "Bearer " e devolve apenas o token limpo
        return authHeader.replace("Bearer ", "");
    }
}
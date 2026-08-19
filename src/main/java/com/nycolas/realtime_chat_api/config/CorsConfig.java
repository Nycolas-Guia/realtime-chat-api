package com.nycolas.realtime_chat_api.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**") // Libera para todos os endpoints da API
                .allowedOriginPatterns("*") // Permite qualquer frontend (Vite, Postman, etc)
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS") // Permite todos os verbos
                .allowedHeaders("*")
                .allowCredentials(false);
    }
}
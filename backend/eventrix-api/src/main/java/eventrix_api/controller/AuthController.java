package eventrix_api.controller;

import eventrix_api.dto.LoginRequest;
import eventrix_api.dto.GoogleLoginRequest;
import eventrix_api.dto.RegistroRequest;
import eventrix_api.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    @GetMapping("/estado")
    public ResponseEntity<Map<String, String>> estado() {
        return ResponseEntity.ok(Map.of(
                "mensaje", "El módulo de autenticación de EVENTRIX está funcionando."
        ));
    }

    @PostMapping("/registro")
    public ResponseEntity<Map<String, String>> registrarUsuario(
            @Valid @RequestBody RegistroRequest solicitud) {

        try {
            String token = authService.registrarUsuario(solicitud);

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Tu cuenta de EVENTRIX fue creada correctamente",
                    "token", token,
                    "tipo", "Bearer"
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, String>> iniciarSesion(
            @Valid @RequestBody LoginRequest solicitud) {

        try {
            String token = authService.iniciarSesion(solicitud);

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "tipo", "Bearer"
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "Correo o contraseña incorrectos"
                    ));

        } catch (AuthenticationException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", "No fue posible autenticar al usuario"
                    ));
        }
    }

    @PostMapping("/google")
    public ResponseEntity<Map<String, String>> iniciarSesionConGoogle(
            @Valid @RequestBody GoogleLoginRequest solicitud) {

        try {
            String token = authService.iniciarSesionConGoogle(
                    solicitud.getCredential(),
                    solicitud.getTipoCuenta()
            );

            return ResponseEntity.ok(Map.of(
                    "token", token,
                    "tipo", "Bearer"
            ));

        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of(
                            "error", e.getMessage()
                    ));
        }
    }
}

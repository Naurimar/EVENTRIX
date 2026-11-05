
package eventrix_api.controller;

import eventrix_api.dto.LoginRequest;
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
}

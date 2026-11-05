
package eventrix_api.controller;

import eventrix_api.dto.UsuarioRequest;
import eventrix_api.dto.UsuarioResponse;
import eventrix_api.model.Usuario;
import eventrix_api.service.UsuarioService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.NoSuchElementException;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    // Registrar un usuario
    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> registrarUsuario(
            @Valid @RequestBody UsuarioRequest solicitud) {

        try {
            Usuario usuario = usuarioService.registrarUsuario(solicitud);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "mensaje", "Usuario registrado correctamente",
                            "id", usuario.getId(),
                            "nombre", usuario.getNombre(),
                            "correo", usuario.getCorreo(),
                            "rol", usuario.getRol().getNombre()
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("mensaje", e.getMessage())
            );
        }
    }

    // Consultar todos los usuarios
    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<UsuarioResponse>> listarUsuarios() {

        List<UsuarioResponse> usuarios =
                usuarioService.listarUsuarios();

        return ResponseEntity.ok(usuarios);
    }

    // Consultar un usuario por ID
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<?> buscarUsuarioPorId(
            @PathVariable Integer id) {

        try {
            UsuarioResponse usuario =
                    usuarioService.buscarUsuarioPorId(id);

            return ResponseEntity.ok(usuario);

        } catch (NoSuchElementException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(
                    Map.of("mensaje", e.getMessage())
            );
        }
    }
}

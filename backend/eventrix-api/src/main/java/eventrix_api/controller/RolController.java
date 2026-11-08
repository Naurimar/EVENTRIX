package eventrix_api.controller;

import eventrix_api.dto.RolRequest;
import eventrix_api.dto.RolResponse;
import eventrix_api.service.RolService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/roles")
public class RolController {

    private final RolService rolService;

    public RolController(RolService rolService) {
        this.rolService = rolService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<List<RolResponse>> listarRoles() {
        return ResponseEntity.ok(rolService.listarRoles());
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<RolResponse> buscarRolPorId(
            @PathVariable Integer id) {

        return ResponseEntity.ok(rolService.buscarRolPorId(id));
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<RolResponse> crearRol(
            @Valid @RequestBody RolRequest solicitud) {

        return ResponseEntity.status(HttpStatus.CREATED)
                .body(rolService.crearRol(solicitud));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<RolResponse> actualizarRol(
            @PathVariable Integer id,
            @Valid @RequestBody RolRequest solicitud) {

        return ResponseEntity.ok(
                rolService.actualizarRol(id, solicitud)
        );
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMINISTRADOR')")
    public ResponseEntity<Void> eliminarRol(
            @PathVariable Integer id) {

        rolService.eliminarRol(id);
        return ResponseEntity.noContent().build();
    }
}

package eventrix_api.controller;

import eventrix_api.dto.PerfilProveedorRequest;
import eventrix_api.model.PerfilProveedor;
import eventrix_api.model.Usuario;
import eventrix_api.repository.UsuarioRepository;
import eventrix_api.service.PerfilProveedorService;

import jakarta.validation.Valid;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/proveedores")
public class PerfilProveedorController {

    private final PerfilProveedorService perfilService;
    private final UsuarioRepository usuarioRepository;

    public PerfilProveedorController(
            PerfilProveedorService perfilService,
            UsuarioRepository usuarioRepository
    ) {
        this.perfilService = perfilService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping("/perfil")
    @PreAuthorize("hasRole('PROVEEDOR')")
    public ResponseEntity<Map<String, Object>> registrarPerfil(
            @Valid @RequestBody PerfilProveedorRequest solicitud,
            Authentication authentication
    ) {
        try {
            Usuario usuario = usuarioRepository.findByCorreo(
                    authentication.getName()
            ).orElseThrow(() -> new IllegalArgumentException(
                    "No se encontró el usuario autenticado."
            ));

            PerfilProveedor perfil = new PerfilProveedor();

            perfil.setTipoPersona(solicitud.getTipoPersona());
            perfil.setNombreCompleto(solicitud.getNombreCompleto());
            perfil.setTipoDocumentoTitular(solicitud.getTipoDocumentoTitular());
            perfil.setNumeroDocumentoTitular(solicitud.getNumeroDocumentoTitular());
            perfil.setNit(solicitud.getNit());
            perfil.setDigitoVerificacion(solicitud.getDigitoVerificacion());
            perfil.setRazonSocial(solicitud.getRazonSocial());
            perfil.setNombreRepresentante(solicitud.getNombreRepresentante());
            perfil.setTipoDocumentoRepresentante(solicitud.getTipoDocumentoRepresentante());
            perfil.setNumeroDocumentoRepresentante(solicitud.getNumeroDocumentoRepresentante());
            perfil.setTelefonoContacto(solicitud.getTelefonoContacto());

            PerfilProveedor registrado = perfilService.registrarPerfil(
                    usuario.getId(),
                    perfil
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "El perfil del proveedor fue registrado correctamente.",
                    "idPerfil", registrado.getId(),
                    "estadoVerificacion", registrado.getEstadoVerificacion().name()
            ));

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", e.getMessage()
            ));
        }
    }
}

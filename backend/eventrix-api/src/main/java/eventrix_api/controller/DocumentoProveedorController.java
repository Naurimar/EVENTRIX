package eventrix_api.controller;

import eventrix_api.model.DocumentoProveedor;
import eventrix_api.model.Usuario;
import eventrix_api.repository.UsuarioRepository;
import eventrix_api.service.DocumentoProveedorService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/proveedores/documentos")
public class DocumentoProveedorController {

    private final DocumentoProveedorService documentoService;
    private final UsuarioRepository usuarioRepository;

    public DocumentoProveedorController(
            DocumentoProveedorService documentoService,
            UsuarioRepository usuarioRepository
    ) {
        this.documentoService = documentoService;
        this.usuarioRepository = usuarioRepository;
    }

    @PostMapping(consumes = "multipart/form-data")
    @PreAuthorize("hasRole('PROVEEDOR')")
    public ResponseEntity<?> cargarDocumento(
            @RequestParam("tipoDocumento") DocumentoProveedor.TipoDocumento tipoDocumento,
            @RequestParam("archivo") MultipartFile archivo,
            Authentication authentication
    ) {
        try {
            Usuario usuario = usuarioRepository.findByCorreo(authentication.getName())
                    .orElseThrow(() -> new IllegalArgumentException(
                            "No se encontro el usuario autenticado."
                    ));

            DocumentoProveedor documento = documentoService.cargarDocumento(
                    usuario.getId(),
                    tipoDocumento,
                    archivo
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    "mensaje", "Documento cargado correctamente.",
                    "idDocumento", documento.getId(),
                    "tipoDocumento", documento.getTipoDocumento(),
                    "nombreArchivo", documento.getNombreArchivo(),
                    "tipoMime", documento.getTipoMime(),
                    "tamanoBytes", documento.getTamanoBytes(),
                    "estadoDocumento", documento.getEstadoDocumento()
            ));

        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of(
                    "error", ex.getMessage()
            ));

        } catch (IOException ex) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "error", "No fue posible almacenar el documento."
            ));
        }
    }
}

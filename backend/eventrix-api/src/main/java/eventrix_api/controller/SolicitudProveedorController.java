package eventrix_api.controller;

import eventrix_api.dto.SolicitudProveedorRequest;
import eventrix_api.service.RegistroCompletoProveedorService;

import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/solicitudes-proveedor")
public class SolicitudProveedorController {

    private final RegistroCompletoProveedorService registroService;

    public SolicitudProveedorController(
            RegistroCompletoProveedorService registroService) {
        this.registroService = registroService;
    }

    @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<Map<String, Object>> registrar(
            @RequestPart("solicitud") SolicitudProveedorRequest request,
            @RequestParam("tipos") List<String> tipos,
            @RequestParam("documentos") List<MultipartFile> documentos) {

        try {
            RegistroCompletoProveedorService.ResultadoRegistro resultado =
                    registroService.registrar(request, tipos, documentos);

            return ResponseEntity.status(HttpStatus.CREATED).body(
                    Map.of(
                            "mensaje", "Tu solicitud y tus documentos fueron recibidos correctamente. Quedaron pendientes de revisión administrativa.",
                            "idSolicitud", resultado.idSolicitud(),
                            "cantidadDocumentos", resultado.cantidadDocumentos(),
                            "estado", "PENDIENTE_REVISION_ADMIN"
                    )
            );

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(
                    Map.of("error", e.getMessage())
            );

        } catch (RuntimeException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(
                    Map.of(
                            "error",
                            "No fue posible procesar la solicitud y sus documentos. Contacta al equipo de EVENTRIX."
                    )
            );
        }
    }
}
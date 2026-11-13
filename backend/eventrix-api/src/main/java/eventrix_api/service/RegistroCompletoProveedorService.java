package eventrix_api.service;

import eventrix_api.dto.SolicitudProveedorRequest;
import eventrix_api.dto.SolicitudProveedorResponse;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@Service
public class RegistroCompletoProveedorService {

    private final SolicitudProveedorService solicitudService;
    private final CargaDocumentoSolicitudService cargaDocumentoService;

    public RegistroCompletoProveedorService(
            SolicitudProveedorService solicitudService,
            CargaDocumentoSolicitudService cargaDocumentoService) {
        this.solicitudService = solicitudService;
        this.cargaDocumentoService = cargaDocumentoService;
    }

    @Transactional(rollbackFor = Exception.class)
    public ResultadoRegistro registrar(
            SolicitudProveedorRequest request,
            List<String> tipos,
            List<MultipartFile> documentos) {

        SolicitudProveedorResponse solicitud =
                solicitudService.registrar(request);

        int cantidad = cargaDocumentoService.cargarDocumentos(
                solicitud.getTokenCarga(),
                tipos,
                documentos
        );

        return new ResultadoRegistro(
                solicitud.getIdSolicitud(),
                cantidad
        );
    }

    public record ResultadoRegistro(
            Integer idSolicitud,
            int cantidadDocumentos) {
    }
}

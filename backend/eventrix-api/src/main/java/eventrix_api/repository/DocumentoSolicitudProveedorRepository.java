package eventrix_api.repository;

import eventrix_api.model.DocumentoSolicitudProveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface DocumentoSolicitudProveedorRepository
        extends JpaRepository<DocumentoSolicitudProveedor, Integer> {

    List<DocumentoSolicitudProveedor> findBySolicitud_Id(Integer idSolicitud);

    boolean existsBySolicitud_IdAndTipoDocumento(
            Integer idSolicitud,
            DocumentoSolicitudProveedor.TipoDocumento tipoDocumento
    );

    long countBySolicitud_Id(Integer idSolicitud);
}
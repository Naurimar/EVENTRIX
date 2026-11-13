package eventrix_api.repository;

import eventrix_api.model.SolicitudProveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SolicitudProveedorRepository
        extends JpaRepository<SolicitudProveedor, Integer> {

    Optional<SolicitudProveedor> findByTokenCargaHash(String tokenCargaHash);

    List<SolicitudProveedor> findByEstadoSolicitud(
            SolicitudProveedor.EstadoSolicitud estadoSolicitud
    );

    boolean existsByCorreoIgnoreCaseAndEstadoSolicitudIn(
            String correo,
            List<SolicitudProveedor.EstadoSolicitud> estados
    );
}
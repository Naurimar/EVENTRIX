package eventrix_api.repository;

import eventrix_api.model.DocumentoProveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface DocumentoProveedorRepository extends JpaRepository<DocumentoProveedor, Integer> {

    List<DocumentoProveedor> findByPerfilProveedor_Id(Integer idPerfil);

    Optional<DocumentoProveedor> findByIdAndPerfilProveedor_Usuario_Id(
            Integer idDocumento,
            Integer idUsuario
    );

    boolean existsByPerfilProveedor_IdAndTipoDocumento(
            Integer idPerfil,
            DocumentoProveedor.TipoDocumento tipoDocumento
    );
}

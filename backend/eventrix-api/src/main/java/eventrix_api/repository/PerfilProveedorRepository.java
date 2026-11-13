package eventrix_api.repository;

import eventrix_api.model.PerfilProveedor;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PerfilProveedorRepository extends JpaRepository<PerfilProveedor, Integer> {

    Optional<PerfilProveedor> findByUsuario_Id(Integer idUsuario);

    boolean existsByUsuario_Id(Integer idUsuario);
}

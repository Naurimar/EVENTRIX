package eventrix_api.repository;

import eventrix_api.model.Ciudad;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CiudadRepository extends JpaRepository<Ciudad, Integer> {

    List<Ciudad> findByIdDepartamentoOrderByNombreCiudadAsc(Integer idDepartamento);
}
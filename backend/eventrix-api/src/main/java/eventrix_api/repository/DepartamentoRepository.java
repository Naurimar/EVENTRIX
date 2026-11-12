package eventrix_api.repository;

import eventrix_api.model.Departamento;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface DepartamentoRepository extends JpaRepository<Departamento, Integer> {

    List<Departamento> findAllByOrderByNombreDepartamentoAsc();
}
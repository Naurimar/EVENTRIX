package eventrix_api.controller;

import eventrix_api.model.Departamento;
import eventrix_api.repository.DepartamentoRepository;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/departamentos")
public class DepartamentoController {

    private final DepartamentoRepository departamentoRepository;

    public DepartamentoController(DepartamentoRepository departamentoRepository) {
        this.departamentoRepository = departamentoRepository;
    }

    @GetMapping
    public List<Departamento> listar() {
        return departamentoRepository.findAllByOrderByNombreDepartamentoAsc();
    }
}
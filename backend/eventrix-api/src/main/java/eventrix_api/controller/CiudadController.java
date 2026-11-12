package eventrix_api.controller;

import eventrix_api.model.Ciudad;
import eventrix_api.repository.CiudadRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/ciudades")
public class CiudadController {

    private final CiudadRepository ciudadRepository;

    public CiudadController(CiudadRepository ciudadRepository) {
        this.ciudadRepository = ciudadRepository;
    }

    @GetMapping
    public List<Ciudad> listar(
            @RequestParam Integer departamentoId) {
        return ciudadRepository
                .findByIdDepartamentoOrderByNombreCiudadAsc(departamentoId);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Ciudad> buscar(@PathVariable Integer id) {
        return ciudadRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
}
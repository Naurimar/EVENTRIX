package eventrix_api.controller;

import eventrix_api.model.TipoServicio;
import eventrix_api.repository.TipoServicioRepository;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores/tipos-servicio")
@CrossOrigin(origins = "http://localhost:5173")
public class TipoServicioController {

    private final TipoServicioRepository tipoServicioRepository;

    public TipoServicioController(TipoServicioRepository tipoServicioRepository) {
        this.tipoServicioRepository = tipoServicioRepository;
    }

    @GetMapping
    public List<TipoServicio> listarTiposServicio() {
        return tipoServicioRepository.listarTodos();
    }
}


package eventrix_api.controller;

import eventrix_api.model.ResumenReporte;
import eventrix_api.repository.ReporteRepository;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
public class ReporteController {

    private final ReporteRepository reporteRepository;

    public ReporteController(ReporteRepository reporteRepository) {
        this.reporteRepository = reporteRepository;
    }

    @GetMapping("/estado")
    public Map<String, String> estado() {
        return Map.of(
            "modulo", "Reportes de EVENTRIX",
            "estado", "funcionando"
        );
    }

    @GetMapping("/resumen")
    public ResumenReporte obtenerResumen() {
        return reporteRepository.obtenerResumen();
    }
}

package eventrix_api.controller;

import eventrix_api.model.ResumenReporte;
import eventrix_api.repository.ReporteRepository;
import eventrix_api.service.ReportePdfService;

import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Map;

@RestController
@RequestMapping("/api/reportes")
@CrossOrigin(origins = "http://localhost:5173")
public class ReporteController {

    private final ReporteRepository reporteRepository;
    private final ReportePdfService reportePdfService;

    public ReporteController(
            ReporteRepository reporteRepository,
            ReportePdfService reportePdfService) {

        this.reporteRepository = reporteRepository;
        this.reportePdfService = reportePdfService;
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

    // ==========================================
    // DESCARGAR REPORTE PDF
    // ==========================================

    @GetMapping(
        value = "/pdf",
        produces = MediaType.APPLICATION_PDF_VALUE
    )
    public ResponseEntity<byte[]> descargarReportePdf()
            throws IOException {

        ResumenReporte resumen =
                reporteRepository.obtenerResumen();

        byte[] pdf =
                reportePdfService.generarPdf(resumen);

        HttpHeaders headers = new HttpHeaders();

        headers.setContentType(MediaType.APPLICATION_PDF);

        headers.setContentDisposition(
                ContentDisposition.attachment()
                        .filename("reporte-eventrix.pdf")
                        .build()
        );

        headers.setContentLength(pdf.length);

        return ResponseEntity
                .ok()
                .headers(headers)
                .body(pdf);
    }
}

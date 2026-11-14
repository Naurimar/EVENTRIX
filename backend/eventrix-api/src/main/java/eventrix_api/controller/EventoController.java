
package eventrix_api.controller;

import eventrix_api.model.Evento;
import eventrix_api.service.EventoService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/eventos")
public class EventoController {

    private final EventoService eventoService;

    public EventoController(EventoService eventoService) {
        this.eventoService = eventoService;
    }

    // GET: consultar todos los eventos
    @GetMapping
    public List<Evento> listar() {
        return eventoService.listarEventos();
    }

    // GET: consultar un evento por ID
    @GetMapping("/{id}")
    public ResponseEntity<Evento> buscar(@PathVariable Integer id) {
        return eventoService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: registrar un nuevo evento
    @PostMapping
    public ResponseEntity<Evento> crear(@RequestBody Evento evento) {
        Evento nuevo = eventoService.crearEvento(evento);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    // PUT: actualizar un evento
    @PutMapping("/{id}")
    public ResponseEntity<Evento> actualizar(
            @PathVariable Integer id,
            @RequestBody Evento datos) {

        return eventoService.actualizarEvento(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE: eliminar un evento
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        boolean eliminado = eventoService.eliminarEvento(id);

        return eliminado
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}

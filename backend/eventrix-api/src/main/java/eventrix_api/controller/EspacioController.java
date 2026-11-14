
package eventrix_api.controller;

import eventrix_api.model.Espacio;
import eventrix_api.service.EspacioService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/espacios")
public class EspacioController {

    private final EspacioService espacioService;

    public EspacioController(EspacioService espacioService) {
        this.espacioService = espacioService;
    }

    // GET: consultar todos los espacios
    @GetMapping
    public List<Espacio> listar() {
        return espacioService.listarEspacios();
    }

    // GET: buscar un espacio por su ID
    @GetMapping("/{id}")
    public ResponseEntity<Espacio> buscar(@PathVariable Integer id) {
        return espacioService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // POST: registrar un nuevo espacio
    @PostMapping
    public ResponseEntity<Espacio> crear(@RequestBody Espacio espacio) {
        Espacio nuevo = espacioService.crearEspacio(espacio);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(nuevo);
    }

    // PUT: actualizar un espacio existente
    @PutMapping("/{id}")
    public ResponseEntity<Espacio> actualizar(
            @PathVariable Integer id,
            @RequestBody Espacio datos) {

        return espacioService.actualizarEspacio(id, datos)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    // DELETE: eliminar un espacio por ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        boolean eliminado = espacioService.eliminarEspacio(id);

        return eliminado
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}


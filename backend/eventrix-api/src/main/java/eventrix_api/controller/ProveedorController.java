
package eventrix_api.controller;

import eventrix_api.model.Proveedor;
import eventrix_api.repository.ProveedorRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;
import java.util.Map;
import org.springframework.web.bind.annotation.DeleteMapping;

import java.util.List;

@RestController
@RequestMapping("/api/proveedores")
@CrossOrigin(origins = "http://localhost:5173")
public class ProveedorController {

    private final ProveedorRepository proveedorRepository;

    public ProveedorController(ProveedorRepository proveedorRepository) {
        this.proveedorRepository = proveedorRepository;
    }

    // CONSULTAR TODOS

    @GetMapping
    public List<Proveedor> listarProveedores() {
        return proveedorRepository.listarTodos();
    }

    // CONSULTAR POR ESTADO

    @GetMapping("/estado")
    public List<Proveedor> listarPorEstado(
            @RequestParam boolean activo) {

        return proveedorRepository.listarPorEstado(activo);
    }

    // CONSULTAR POR ID

    @GetMapping("/{id}")
    public Proveedor buscarProveedor(@PathVariable Integer id) {

        Proveedor proveedor = proveedorRepository.buscarPorId(id);

        if (proveedor == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "El proveedor solicitado no existe.");
        }

        return proveedor;
    }

    // REGISTRAR

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Proveedor registrarProveedor(
            @RequestBody Proveedor proveedor) {

        validarProveedor(proveedor);

        return proveedorRepository.registrar(proveedor);
    }

    // EDITAR

    @PutMapping("/{id}")
    public Proveedor actualizarProveedor(
            @PathVariable Integer id,
            @RequestBody Proveedor proveedor) {

        validarProveedor(proveedor);

        Proveedor actualizado = proveedorRepository.actualizar(id, proveedor);

        if (actualizado == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el proveedor que deseas actualizar.");
        }

        return actualizado;
    }

    // CAMBIAR ESTADO

    @PatchMapping("/{id}/estado")
    public Proveedor cambiarEstado(
            @PathVariable Integer id,
            @RequestParam boolean activo) {

        boolean actualizado = proveedorRepository.cambiarEstado(id, activo);

        if (!actualizado) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "No se encontró el proveedor solicitado.");
        }

        return proveedorRepository.buscarPorId(id);
    }

    // VALIDACIONES

    private void validarProveedor(Proveedor proveedor) {

        if (proveedor == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debes enviar los datos del proveedor.");
        }

        if (proveedor.getNombre() == null ||
                proveedor.getNombre().isBlank()) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El nombre del proveedor es obligatorio.");
        }

        if (proveedor.getIdTipo() == null ||
                proveedor.getIdTipo() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debes seleccionar un tipo de servicio válido.");
        }

        proveedor.setNombre(proveedor.getNombre().trim());

        if (proveedor.getTelefono() != null) {
            proveedor.setTelefono(proveedor.getTelefono().trim());
        }

        if (proveedor.getCorreo() != null) {
            proveedor.setCorreo(proveedor.getCorreo().trim());
        }
    }

    // ELIMINAR PROVEEDOR DE FORMA SEGURA
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {

        Proveedor proveedor = proveedorRepository.buscarPorId(id);

        if (proveedor == null) {
            return ResponseEntity.notFound().build();
        }

        if (proveedorRepository.tieneEventosAsociados(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "mensaje",
                            "No se puede eliminar este proveedor porque está asociado a uno o más eventos. Puedes desactivarlo para conservar su historial."));
        }

        try {
            proveedorRepository.eliminar(id);

            return ResponseEntity.ok(
                    Map.of("mensaje", "Proveedor eliminado correctamente."));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "mensaje",
                            "No se puede eliminar este proveedor porque tiene información relacionada."));
        }
    }
}

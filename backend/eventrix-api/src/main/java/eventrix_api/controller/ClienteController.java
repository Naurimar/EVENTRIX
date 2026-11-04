
package eventrix_api.controller;

import eventrix_api.model.Cliente;
import eventrix_api.service.ClienteService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final ClienteService clienteService;

    public ClienteController(ClienteService clienteService) {
        this.clienteService = clienteService;
    }

    @GetMapping
    public List<Cliente> listar() {
        return clienteService.listarClientes();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> buscar(@PathVariable Integer id) {
        return clienteService.buscarPorId(id)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Cliente> crear(@RequestBody Cliente cliente) {
        cliente.setIdCliente(null);
        Cliente nuevo = clienteService.guardarCliente(cliente);
        return ResponseEntity.status(HttpStatus.CREATED).body(nuevo);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> actualizar(
            @PathVariable Integer id,
            @RequestBody Cliente datos) {

        return clienteService.buscarPorId(id)
                .map(cliente -> {
                    cliente.setDocumento(datos.getDocumento());
                    cliente.setNombre(datos.getNombre());
                    cliente.setTelefono(datos.getTelefono());
                    cliente.setCorreo(datos.getCorreo());

                    return ResponseEntity.ok(
                            clienteService.guardarCliente(cliente)
                    );
                })
                .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Integer id) {
        boolean eliminado = clienteService.eliminarCliente(id);

        return eliminado
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}

package eventrix_api.controller;

import eventrix_api.model.Invitado;
import eventrix_api.model.AsociacionInvitado;
import eventrix_api.repository.InvitadoRepository;

import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/invitados")
public class InvitadoController {

    private final InvitadoRepository invitadoRepository;

    public InvitadoController(InvitadoRepository invitadoRepository) {
        this.invitadoRepository = invitadoRepository;
    }

    // LISTAR TODOS LOS INVITADOS
    @GetMapping
    public ResponseEntity<?> listarTodos() {
        return ResponseEntity.ok(invitadoRepository.listarTodos());
    }

    // BUSCAR INVITADO POR ID
    @GetMapping("/{id}")
    public ResponseEntity<?> buscarPorId(@PathVariable Integer id) {
        Invitado invitado = invitadoRepository.buscarPorId(id);

        if (invitado == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(invitado);
    }

    // LISTAR EVENTOS DISPONIBLES
    @GetMapping("/eventos")
    public ResponseEntity<?> listarEventos() {
        return ResponseEntity.ok(invitadoRepository.listarEventos());
    }

    // LISTAR MESAS DE UN EVENTO
    @GetMapping("/eventos/{idEvento}/mesas")
    public ResponseEntity<?> listarMesasPorEvento(
            @PathVariable Integer idEvento) {

        if (!invitadoRepository.existeEvento(idEvento)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                invitadoRepository.listarMesasPorEvento(idEvento));
    }

    // LISTAR INVITADOS ASOCIADOS A UN EVENTO
    @GetMapping("/eventos/{idEvento}/invitados")
    public ResponseEntity<?> listarInvitadosPorEvento(
            @PathVariable Integer idEvento) {

        if (!invitadoRepository.existeEvento(idEvento)) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                invitadoRepository.listarInvitadosPorEvento(idEvento));
    }

    // ACTUALIZAR RSVP DE UN INVITADO EN UN EVENTO
    @PatchMapping("/eventos/{idEvento}/invitados/{idInvitado}/rsvp")
    public ResponseEntity<?> actualizarRsvp(
            @PathVariable Integer idEvento,
            @PathVariable Integer idInvitado,
            @RequestBody Map<String, String> datos) {

        if (!invitadoRepository.existeEvento(idEvento)) {
            return ResponseEntity.notFound().build();
        }

        if (invitadoRepository.buscarPorId(idInvitado) == null) {
            return ResponseEntity.notFound().build();
        }

        String estadoRsvp = datos.get("estadoRsvp");

        if (estadoRsvp == null
                || (!estadoRsvp.equalsIgnoreCase("Pendiente")
                        && !estadoRsvp.equalsIgnoreCase("Confirmado")
                        && !estadoRsvp.equalsIgnoreCase("Rechazado"))) {

            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "El estado RSVP no es válido."));
        }

        boolean actualizado = invitadoRepository.actualizarRsvp(
                idEvento, idInvitado, estadoRsvp);

        if (!actualizado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                Map.of("mensaje", "Estado RSVP actualizado correctamente."));
    }

    // ACTUALIZAR MESA DE UN INVITADO EN UN EVENTO
    // ACTUALIZAR MESA DE UN INVITADO EN UN EVENTO
    @PatchMapping("/eventos/{idEvento}/invitados/{idInvitado}/mesa")
    public ResponseEntity<?> actualizarMesa(
            @PathVariable Integer idEvento,
            @PathVariable Integer idInvitado,
            @RequestBody Map<String, Integer> datos) {

        if (!invitadoRepository.existeEvento(idEvento)) {
            return ResponseEntity.notFound().build();
        }

        if (invitadoRepository.buscarPorId(idInvitado) == null) {
            return ResponseEntity.notFound().build();
        }

        Integer idMesa = datos.get("idMesa");

        try {
            boolean actualizado = invitadoRepository.actualizarMesa(
                    idEvento,
                    idInvitado,
                    idMesa);

            if (!actualizado) {
                return ResponseEntity.notFound().build();
            }

            return ResponseEntity.ok(
                    Map.of("mensaje", "Mesa actualizada correctamente."));

        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT).body(
                    Map.of("mensaje", e.getMessage()));
        }
    }

    // REGISTRAR INVITADO
    @PostMapping
    public ResponseEntity<?> registrar(@RequestBody Invitado invitado) {

        ResponseEntity<?> validacion = validarInvitado(invitado);

        if (validacion != null) {
            return validacion;
        }

        Integer idGenerado = invitadoRepository.registrar(invitado);

        if (idGenerado == null) {
            return ResponseEntity.internalServerError().body(
                    Map.of("mensaje", "No se pudo obtener el ID del invitado."));
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(
                Map.of(
                        "mensaje", "Invitado registrado correctamente.",
                        "idInvitado", idGenerado));
    }

    // ASOCIAR INVITADO A UN EVENTO
    @PostMapping("/asociar")
    public ResponseEntity<?> asociarInvitado(
            @RequestBody AsociacionInvitado asociacion) {

        if (asociacion == null
                || asociacion.getIdEvento() == null
                || asociacion.getIdInvitado() == null) {

            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "Debes seleccionar un evento y un invitado."));
        }

        Integer idEvento = asociacion.getIdEvento();
        Integer idInvitado = asociacion.getIdInvitado();
        Integer idMesa = asociacion.getIdMesa();

        String estadoRsvp = asociacion.getEstadoRsvp();

        if (estadoRsvp == null || estadoRsvp.isBlank()) {
            estadoRsvp = "Pendiente";
        }

        if (!estadoRsvp.equalsIgnoreCase("Pendiente")
                && !estadoRsvp.equalsIgnoreCase("Confirmado")
                && !estadoRsvp.equalsIgnoreCase("Rechazado")) {

            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El estado RSVP no es válido."));
        }

        if (!invitadoRepository.existeEvento(idEvento)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El evento seleccionado no existe."));
        }

        if (invitadoRepository.buscarPorId(idInvitado) == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El invitado seleccionado no existe."));
        }

        if (invitadoRepository.existeAsociacion(idEvento, idInvitado)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje",
                            "Este invitado ya está asociado a este evento."));
        }

        if (idMesa != null
                && !invitadoRepository.mesaPerteneceEvento(idMesa, idEvento)) {

            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "La mesa seleccionada no pertenece a este evento."));
        }

        try {
            invitadoRepository.asociarInvitado(
                    idEvento,
                    idInvitado,
                    idMesa,
                    estadoRsvp);

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of("mensaje",
                            "Invitado asociado al evento correctamente."));

        } catch (IllegalStateException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje", e.getMessage()));

        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje",
                            "No se pudo realizar la asociación. Verifica los datos seleccionados."));
        }
    }

    // ACTUALIZAR INVITADO
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizar(
            @PathVariable Integer id,
            @RequestBody Invitado invitado) {

        if (invitadoRepository.buscarPorId(id) == null) {
            return ResponseEntity.notFound().build();
        }

        ResponseEntity<?> validacion = validarInvitado(invitado);

        if (validacion != null) {
            return validacion;
        }

        invitadoRepository.actualizar(id, invitado);

        return ResponseEntity.ok(
                Map.of("mensaje", "Invitado actualizado correctamente."));
    }

    // ELIMINAR INVITADO CON PROTECCIÓN
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminar(@PathVariable Integer id) {

        Invitado invitado = invitadoRepository.buscarPorId(id);

        if (invitado == null) {
            return ResponseEntity.notFound().build();
        }

        if (invitadoRepository.tieneEventosAsociados(id)) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje",
                            "No se puede eliminar este invitado porque está asociado a uno o más eventos. Puedes conservarlo para mantener su historial."));
        }

        try {
            invitadoRepository.eliminar(id);

            return ResponseEntity.ok(
                    Map.of("mensaje", "Invitado eliminado correctamente."));

        } catch (DataIntegrityViolationException e) {

            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("mensaje",
                            "No se puede eliminar este invitado porque tiene información relacionada."));
        }
    }

    // VALIDAR DATOS DEL INVITADO
    private ResponseEntity<?> validarInvitado(Invitado invitado) {

        if (invitado == null) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje", "Debes proporcionar los datos del invitado."));
        }

        if (invitado.getNombre() == null
                || invitado.getNombre().isBlank()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El nombre del invitado es obligatorio."));
        }

        if (invitado.getNombre().length() > 100) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El nombre no puede superar los 100 caracteres."));
        }

        if (invitado.getCorreo() != null
                && invitado.getCorreo().length() > 150) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El correo no puede superar los 150 caracteres."));
        }

        if (invitado.getTelefono() != null
                && invitado.getTelefono().length() > 30) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El teléfono no puede superar los 30 caracteres."));
        }

        if (invitado.getRestriccionDietetica() != null
                && invitado.getRestriccionDietetica().length() > 100) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "La restricción dietética no puede superar los 100 caracteres."));
        }

        if (invitado.getEstadoRsvp() != null
                && invitado.getEstadoRsvp().length() > 30) {
            return ResponseEntity.badRequest()
                    .body(Map.of("mensaje",
                            "El estado RSVP no puede superar los 30 caracteres."));
        }

        return null;
    }

    // RETIRAR INVITADO DE UN EVENTO
    @DeleteMapping("/eventos/{idEvento}/invitados/{idInvitado}")
    public ResponseEntity<?> desasociarInvitado(
            @PathVariable Integer idEvento,
            @PathVariable Integer idInvitado) {

        if (!invitadoRepository.existeEvento(idEvento)) {
            return ResponseEntity.notFound().build();
        }

        if (invitadoRepository.buscarPorId(idInvitado) == null) {
            return ResponseEntity.notFound().build();
        }

        boolean eliminado = invitadoRepository.desasociarInvitado(
                idEvento,
                idInvitado);

        if (!eliminado) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(
                Map.of("mensaje",
                        "Invitado retirado del evento correctamente."));
    }

}

package eventrix_api.controller;

import eventrix_api.model.Reserva;
import eventrix_api.repository.ReservaRepository;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.dao.DataIntegrityViolationException;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reservas")
@CrossOrigin(origins = "http://localhost:5173")
public class ReservaController {

    private final ReservaRepository reservaRepository;

    public ReservaController(ReservaRepository reservaRepository) {
        this.reservaRepository = reservaRepository;
    }

    // CONSULTAR TODAS

    @GetMapping
    public List<Reserva> listarReservas() {
        return reservaRepository.listarTodas();
    }

    // CONSULTAR POR ID

    @GetMapping("/{id}")
    public Reserva buscarReserva(@PathVariable Integer id) {

        Reserva reserva = reservaRepository.buscarPorId(id);

        if (reserva == null) {
            throw new ResponseStatusException(
                    HttpStatus.NOT_FOUND,
                    "La reserva solicitada no existe.");
        }

        return reserva;
    }

    // CONSULTAR POR EVENTO

    @GetMapping("/evento/{idEvento}")
    public List<Reserva> listarPorEvento(
            @PathVariable Integer idEvento) {

        return reservaRepository.listarPorEvento(idEvento);
    }

    // CONSULTAR POR ESPACIO

    @GetMapping("/espacio/{idEspacio}")
    public List<Reserva> listarPorEspacio(
            @PathVariable Integer idEspacio) {

        return reservaRepository.listarPorEspacio(idEspacio);
    }

    // REGISTRAR

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Reserva registrarReserva(@RequestBody Reserva reserva) {

        validarReserva(reserva);

        try {
            return reservaRepository.registrar(reserva);

        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se pudo registrar la reserva. Verifica que el evento y el espacio existan.",
                    e);
        }
    }

    // ACTUALIZAR

    @PutMapping("/{id}")
    public Reserva actualizarReserva(
            @PathVariable Integer id,
            @RequestBody Reserva reserva) {

        validarReserva(reserva);

        try {
            Reserva actualizado =
                    reservaRepository.actualizar(id, reserva);

            if (actualizado == null) {
                throw new ResponseStatusException(
                        HttpStatus.NOT_FOUND,
                        "No se encontró la reserva que deseas actualizar.");
            }

            return actualizado;

        } catch (DataIntegrityViolationException e) {
            throw new ResponseStatusException(
                    HttpStatus.CONFLICT,
                    "No se pudo actualizar la reserva. Verifica los datos relacionados.",
                    e);
        }
    }

    // ELIMINAR

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarReserva(@PathVariable Integer id) {

        Reserva reserva = reservaRepository.buscarPorId(id);

        if (reserva == null) {
            return ResponseEntity.notFound().build();
        }

        try {
            reservaRepository.eliminar(id);

            return ResponseEntity.ok(
                    Map.of("mensaje", "Reserva eliminada correctamente."));

        } catch (DataIntegrityViolationException e) {
            return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of(
                            "mensaje",
                            "No se puede eliminar la reserva porque tiene información relacionada."));
        }
    }

    // VALIDACIONES

    private void validarReserva(Reserva reserva) {

        if (reserva == null) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debes enviar los datos de la reserva.");
        }

        if (reserva.getFechaInicio() == null ||
                reserva.getFechaFin() == null) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Las fechas de inicio y finalización son obligatorias.");
        }

        if (!reserva.getFechaFin().isAfter(reserva.getFechaInicio())) {
            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "La fecha de finalización debe ser posterior a la fecha de inicio.");
        }

        if (reserva.getEstado() == null ||
                reserva.getEstado().isBlank() ||
                reserva.getEstado().trim().length() > 30) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El estado es obligatorio y no puede superar 30 caracteres.");
        }

        if (reserva.getCostoTotal() != null &&
                reserva.getCostoTotal().compareTo(BigDecimal.ZERO) < 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "El costo total no puede ser negativo.");
        }

        if (reserva.getIdEvento() == null ||
                reserva.getIdEvento() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debes seleccionar un evento válido.");
        }

        if (reserva.getIdEspacio() == null ||
                reserva.getIdEspacio() <= 0) {

            throw new ResponseStatusException(
                    HttpStatus.BAD_REQUEST,
                    "Debes seleccionar un espacio válido.");
        }

        reserva.setEstado(reserva.getEstado().trim());
    }
}

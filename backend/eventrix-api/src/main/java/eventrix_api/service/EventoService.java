
package eventrix_api.service;

import eventrix_api.model.Evento;
import eventrix_api.repository.EventoRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EventoService {

    private final EventoRepository eventoRepository;

    public EventoService(EventoRepository eventoRepository) {
        this.eventoRepository = eventoRepository;
    }

    // Consultar todos los eventos
    @Transactional(readOnly = true)
    public List<Evento> listarEventos() {
        return eventoRepository.findAll();
    }

    // Buscar un evento por su identificador
    @Transactional(readOnly = true)
    public Optional<Evento> buscarPorId(Integer id) {
        return eventoRepository.findById(id);
    }

    // Crear un nuevo evento
    @Transactional
    public Evento crearEvento(Evento evento) {
        evento.setIdEvento(null);
        return eventoRepository.save(evento);
    }

    // Actualizar un evento existente
    @Transactional
    public Optional<Evento> actualizarEvento(Integer id, Evento datos) {
        return eventoRepository.findById(id)
                .map(evento -> {
                    evento.setNombre(datos.getNombre());
                    evento.setTipo(datos.getTipo());
                    evento.setFecha(datos.getFecha());
                    evento.setHoraInicio(datos.getHoraInicio());
                    evento.setPresupuesto(datos.getPresupuesto());
                    evento.setEstado(datos.getEstado());
                    evento.setTematica(datos.getTematica());
                    evento.setNumInvitados(datos.getNumInvitados());
                    evento.setIdUsuario(datos.getIdUsuario());
                    evento.setIdCliente(datos.getIdCliente());

                    return eventoRepository.save(evento);
                });
    }

    // Eliminar un evento si existe
    @Transactional
    public boolean eliminarEvento(Integer id) {
        if (!eventoRepository.existsById(id)) {
            return false;
        }

        eventoRepository.deleteById(id);
        return true;
    }
}

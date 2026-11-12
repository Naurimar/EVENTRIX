

package eventrix_api.service;

import eventrix_api.model.Espacio;
import eventrix_api.repository.EspacioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class EspacioService {

    private final EspacioRepository espacioRepository;

    public EspacioService(EspacioRepository espacioRepository) {
        this.espacioRepository = espacioRepository;
    }

    // Consultar todos los espacios
    @Transactional(readOnly = true)
    public List<Espacio> listarEspacios() {
        return espacioRepository.findAll();
    }

    // Buscar un espacio por ID
    @Transactional(readOnly = true)
    public Optional<Espacio> buscarPorId(Integer id) {
        return espacioRepository.findById(id);
    }

    // Crear un espacio
    @Transactional
    public Espacio crearEspacio(Espacio espacio) {
        espacio.setIdEspacio(null);
        return espacioRepository.save(espacio);
    }

    // Actualizar un espacio existente
    @Transactional
    public Optional<Espacio> actualizarEspacio(Integer id, Espacio datos) {
        return espacioRepository.findById(id)
                .map(espacio -> {
                    espacio.setNombre(datos.getNombre());
                    espacio.setTipo(datos.getTipo());
                    espacio.setCapacidad(datos.getCapacidad());
                    espacio.setUbicacion(datos.getUbicacion());
                    espacio.setTarifa(datos.getTarifa());
                    espacio.setDisponible(datos.getDisponible());
                    espacio.setIdCiudad(datos.getIdCiudad());

                    return espacioRepository.save(espacio);
                });
    }

    // Eliminar un espacio si existe
    @Transactional
    public boolean eliminarEspacio(Integer id) {
        if (!espacioRepository.existsById(id)) {
            return false;
        }

        espacioRepository.deleteById(id);
        return true;
    }
}

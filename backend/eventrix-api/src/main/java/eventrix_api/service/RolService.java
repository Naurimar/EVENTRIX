package eventrix_api.service;

import eventrix_api.dto.RolRequest;
import eventrix_api.dto.RolResponse;
import eventrix_api.model.Rol;
import eventrix_api.repository.RolRepository;
import eventrix_api.repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class RolService {

    private final RolRepository rolRepository;
    private final UsuarioRepository usuarioRepository;

    public RolService(
            RolRepository rolRepository,
            UsuarioRepository usuarioRepository) {

        this.rolRepository = rolRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional(readOnly = true)
    public List<RolResponse> listarRoles() {

        return rolRepository.findAll()
                .stream()
                .map(this::convertirARespuesta)
                .toList();
    }

    @Transactional(readOnly = true)
    public RolResponse buscarRolPorId(Integer id) {

        Rol rol = obtenerRol(id);

        return convertirARespuesta(rol);
    }

    @Transactional
    public RolResponse crearRol(RolRequest solicitud) {

        String nombre = solicitud.getNombre().trim();

        boolean existe = rolRepository.findAll()
                .stream()
                .anyMatch(rol ->
                        rol.getNombre().equalsIgnoreCase(nombre));

        if (existe) {
            throw new IllegalArgumentException(
                    "Ya existe un rol con ese nombre"
            );
        }

        Rol rol = new Rol();
        rol.setNombre(nombre);
        rol.setDescripcion(normalizarDescripcion(
                solicitud.getDescripcion()
        ));

        return convertirARespuesta(rolRepository.save(rol));
    }

    @Transactional
    public RolResponse actualizarRol(Integer id, RolRequest solicitud) {

        Rol rol = obtenerRol(id);
        String nombre = solicitud.getNombre().trim();

        boolean existe = rolRepository.findAll()
                .stream()
                .anyMatch(otroRol ->
                        !otroRol.getId().equals(id)
                        && otroRol.getNombre().equalsIgnoreCase(nombre));

        if (existe) {
            throw new IllegalArgumentException(
                    "Ya existe otro rol con ese nombre"
            );
        }

        rol.setNombre(nombre);
        rol.setDescripcion(normalizarDescripcion(
                solicitud.getDescripcion()
        ));

        return convertirARespuesta(rolRepository.save(rol));
    }

    @Transactional
    public void eliminarRol(Integer id) {

        obtenerRol(id);

        if (usuarioRepository.existsByRol_Id(id)) {
            throw new IllegalArgumentException(
                    "No se puede eliminar el rol porque tiene usuarios asociados"
            );
        }

        rolRepository.deleteById(id);
    }

    private Rol obtenerRol(Integer id) {

        return rolRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "No se encontró el rol con ID: " + id
                        )
                );
    }

    private String normalizarDescripcion(String descripcion) {

        if (descripcion == null || descripcion.isBlank()) {
            return null;
        }

        return descripcion.trim();
    }

    private RolResponse convertirARespuesta(Rol rol) {

        return new RolResponse(
                rol.getId(),
                rol.getNombre(),
                rol.getDescripcion()
        );
    }
}

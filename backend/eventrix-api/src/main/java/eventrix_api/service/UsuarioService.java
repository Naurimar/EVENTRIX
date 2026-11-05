
package eventrix_api.service;

import eventrix_api.dto.UsuarioRequest;
import eventrix_api.dto.UsuarioResponse;
import eventrix_api.model.Rol;
import eventrix_api.model.Usuario;
import eventrix_api.repository.RolRepository;
import eventrix_api.repository.UsuarioRepository;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.NoSuchElementException;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;

    public UsuarioService(
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder) {

        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Transactional
    public Usuario registrarUsuario(UsuarioRequest solicitud) {

        if (usuarioRepository.findByCorreo(solicitud.getCorreo()).isPresent()) {
            throw new IllegalArgumentException(
                    "El correo ya esta registrado"
            );
        }

        Rol rol = rolRepository.findById(solicitud.getIdRol())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El rol seleccionado no existe"
                        )
                );

        Usuario usuario = new Usuario();

        usuario.setNombre(solicitud.getNombre());
        usuario.setCorreo(solicitud.getCorreo());
        usuario.setClave(passwordEncoder.encode(solicitud.getClave()));
        usuario.setEstado(true);
        usuario.setRol(rol);

        return usuarioRepository.save(usuario);
    }

    @Transactional(readOnly = true)
    public List<UsuarioResponse> listarUsuarios() {

        return usuarioRepository.findAll()
                .stream()
                .map(usuario -> new UsuarioResponse(
                        usuario.getId(),
                        usuario.getNombre(),
                        usuario.getCorreo(),
                        usuario.getEstado(),
                        usuario.getRol().getNombre()
                ))
                .toList();
    }

    // Consultar un usuario por su identificador
    @Transactional(readOnly = true)
    public UsuarioResponse buscarUsuarioPorId(Integer id) {

        Usuario usuario = usuarioRepository.findById(id)
                .orElseThrow(() ->
                        new NoSuchElementException(
                                "No se encontró el usuario con ID: " + id
                        )
                );

        return new UsuarioResponse(
                usuario.getId(),
                usuario.getNombre(),
                usuario.getCorreo(),
                usuario.getEstado(),
                usuario.getRol().getNombre()
        );
    }
}

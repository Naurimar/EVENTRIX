
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

        // Verificar que el correo no este registrado
        if (usuarioRepository.findByCorreo(solicitud.getCorreo()).isPresent()) {
            throw new IllegalArgumentException(
                    "El correo ya esta registrado"
            );
        }

        // Buscar el rol seleccionado
        Rol rol = rolRepository.findById(solicitud.getIdRol())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "El rol seleccionado no existe"
                        )
                );

        // Crear el usuario
        Usuario usuario = new Usuario();

        usuario.setNombre(solicitud.getNombre());
        usuario.setCorreo(solicitud.getCorreo());

        // Cifrar la contrasena con BCrypt
        usuario.setClave(
                passwordEncoder.encode(solicitud.getClave())
        );

        // Asignar estado activo
        usuario.setEstado(true);

        // Asignar el rol
        usuario.setRol(rol);

        // Guardar en MySQL
        return usuarioRepository.save(usuario);
    }

    // Consultar todos los usuarios
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
}

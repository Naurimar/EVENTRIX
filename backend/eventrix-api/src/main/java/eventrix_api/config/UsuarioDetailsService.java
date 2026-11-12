
package eventrix_api.config;

import eventrix_api.model.Usuario;
import eventrix_api.repository.UsuarioRepository;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UsuarioDetailsService implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UsuarioDetailsService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String correo)
            throws UsernameNotFoundException {

        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() ->
                        new UsernameNotFoundException(
                                "No se encontró un usuario con ese correo"
                        )
                );

        if (!Boolean.TRUE.equals(usuario.getEstado())) {
            throw new UsernameNotFoundException(
                    "El usuario está inactivo"
            );
        }

        return User.withUsername(usuario.getCorreo())
                .password(usuario.getClave())
                .authorities(List.of(
    new SimpleGrantedAuthority(
        "ROLE_" + usuario.getRol().getNombre()
    )
))
                .build();
    }
}

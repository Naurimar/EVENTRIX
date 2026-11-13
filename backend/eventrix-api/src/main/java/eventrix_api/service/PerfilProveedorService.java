package eventrix_api.service;

import eventrix_api.model.PerfilProveedor;
import eventrix_api.model.Usuario;
import eventrix_api.repository.PerfilProveedorRepository;
import eventrix_api.repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PerfilProveedorService {

    private final PerfilProveedorRepository perfilRepository;
    private final UsuarioRepository usuarioRepository;

    public PerfilProveedorService(
            PerfilProveedorRepository perfilRepository,
            UsuarioRepository usuarioRepository
    ) {
        this.perfilRepository = perfilRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public PerfilProveedor registrarPerfil(
            Integer idUsuario,
            PerfilProveedor perfil
    ) {
        Usuario usuario = usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException(
                        "No existe el usuario indicado."
                ));

        if (!Boolean.TRUE.equals(usuario.getEstado())) {
            throw new IllegalArgumentException(
                    "El usuario no se encuentra activo."
            );
        }

        if (usuario.getRol() == null
                || !"PROVEEDOR".equalsIgnoreCase(usuario.getRol().getNombre())) {
            throw new IllegalArgumentException(
                    "Solo los usuarios con rol PROVEEDOR pueden registrar este perfil."
            );
        }

        if (perfilRepository.existsByUsuario_Id(idUsuario)) {
            throw new IllegalArgumentException(
                    "El usuario ya tiene un perfil de proveedor registrado."
            );
        }

        validarPerfil(perfil);

        perfil.setUsuario(usuario);
        perfil.setEstadoVerificacion(
                PerfilProveedor.EstadoVerificacion.PENDIENTE
        );

        return perfilRepository.save(perfil);
    }

    private void validarPerfil(PerfilProveedor perfil) {
        if (perfil == null || perfil.getTipoPersona() == null) {
            throw new IllegalArgumentException(
                    "Debe indicar si el proveedor es persona natural o jurídica."
            );
        }

        if (perfil.getTipoPersona() == PerfilProveedor.TipoPersona.NATURAL) {
            if (vacio(perfil.getNombreCompleto())
                    || vacio(perfil.getTipoDocumentoTitular())
                    || vacio(perfil.getNumeroDocumentoTitular())) {
                throw new IllegalArgumentException(
                        "Debe completar los datos de identificación de la persona natural."
                );
            }

            perfil.setNit(null);
            perfil.setDigitoVerificacion(null);
            perfil.setRazonSocial(null);
            perfil.setNombreRepresentante(null);
            perfil.setTipoDocumentoRepresentante(null);
            perfil.setNumeroDocumentoRepresentante(null);

        } else {
            if (vacio(perfil.getNit())
                    || vacio(perfil.getDigitoVerificacion())
                    || vacio(perfil.getRazonSocial())
                    || vacio(perfil.getNombreRepresentante())
                    || vacio(perfil.getTipoDocumentoRepresentante())
                    || vacio(perfil.getNumeroDocumentoRepresentante())) {
                throw new IllegalArgumentException(
                        "Debe completar los datos de identificación de la persona jurídica y su representante."
                );
            }

            if (!perfil.getDigitoVerificacion().matches("\\d")) {
                throw new IllegalArgumentException(
                        "El dígito de verificación debe ser un número entre 0 y 9."
                );
            }

            perfil.setNombreCompleto(null);
            perfil.setTipoDocumentoTitular(null);
            perfil.setNumeroDocumentoTitular(null);
        }
    }

    private boolean vacio(String valor) {
        return valor == null || valor.trim().isEmpty();
    }
}

package eventrix_api.service;

import eventrix_api.dto.SolicitudProveedorRequest;
import eventrix_api.dto.SolicitudProveedorResponse;
import eventrix_api.model.SolicitudProveedor;
import eventrix_api.repository.SolicitudProveedorRepository;
import eventrix_api.repository.UsuarioRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.regex.Pattern;

@Service
public class SolicitudProveedorService {

    private static final SecureRandom SECURE_RANDOM = new SecureRandom();

    private static final Pattern CORREO_PATTERN =
            Pattern.compile("^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");

    private static final Pattern DOCUMENTO_PATTERN =
            Pattern.compile("^[a-zA-Z0-9.-]{4,30}$");

    private static final java.util.Set<String> TIPOS_DOCUMENTO_PERMITIDOS =
            java.util.Set.of("CC", "CE", "PPT");

    private static final Pattern NUMERO_PATTERN =
            Pattern.compile("^[0-9]+$");

    private final SolicitudProveedorRepository solicitudRepository;
    private final UsuarioRepository usuarioRepository;

    public SolicitudProveedorService(
            SolicitudProveedorRepository solicitudRepository,
            UsuarioRepository usuarioRepository) {
        this.solicitudRepository = solicitudRepository;
        this.usuarioRepository = usuarioRepository;
    }

    @Transactional
    public SolicitudProveedorResponse registrar(
            SolicitudProveedorRequest request) {

        if (request == null) {
            throw new IllegalArgumentException(
                    "Los datos de la solicitud son obligatorios."
            );
        }

        String correo = obligatorio(
                request.getCorreo(), "El correo electrónico"
        ).toLowerCase(Locale.ROOT);

        if (correo.length() > 150
                || !CORREO_PATTERN.matcher(correo).matches()) {
            throw new IllegalArgumentException(
                    "El correo electrónico no tiene un formato válido."
            );
        }

        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new IllegalArgumentException(
                    "Este correo ya tiene una cuenta en EVENTRIX."
            );
        }

        List<SolicitudProveedor.EstadoSolicitud> estadosActivos =
                List.of(
                        SolicitudProveedor.EstadoSolicitud.RECIBIDA,
                        SolicitudProveedor.EstadoSolicitud.EN_REVISION_IA,
                        SolicitudProveedor.EstadoSolicitud.PENDIENTE_REVISION_ADMIN
                );

        if (solicitudRepository
                .existsByCorreoIgnoreCaseAndEstadoSolicitudIn(
                        correo, estadosActivos)) {
            throw new IllegalArgumentException(
                    "Ya existe una solicitud activa con este correo."
            );
        }

        SolicitudProveedor.TipoPersona tipoPersona;

        try {
            tipoPersona = SolicitudProveedor.TipoPersona.valueOf(
                    obligatorio(
                            request.getTipoPersona(),
                            "El tipo de persona"
                    ).toUpperCase(Locale.ROOT)
            );
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException(
                    "El tipo de persona debe ser NATURAL o JURIDICA."
            );
        }

        SolicitudProveedor solicitud = new SolicitudProveedor();

        solicitud.setCorreo(correo);

        String telefono = obligatorio(
                request.getTelefonoContacto(),
                "El teléfono de contacto"
        );

        if (telefono.length() > 30
                || !telefono.matches("^[0-9+() .-]{7,30}$")) {
            throw new IllegalArgumentException(
                    "El teléfono de contacto tiene un formato inválido."
            );
        }

        solicitud.setTelefonoContacto(telefono);
        solicitud.setTipoPersona(tipoPersona);
        solicitud.setEstadoSolicitud(
                SolicitudProveedor.EstadoSolicitud.RECIBIDA
        );

        if (tipoPersona == SolicitudProveedor.TipoPersona.NATURAL) {
            completarPersonaNatural(request, solicitud);
        } else {
            completarPersonaJuridica(request, solicitud);
        }

        String token = generarTokenSeguro();
        String hash = calcularHash(token);
        LocalDateTime expiracion = LocalDateTime.now().plusHours(24);

        solicitud.setTokenCargaHash(hash);
        solicitud.setTokenCargaExpira(expiracion);

        solicitud = solicitudRepository.save(solicitud);

        return new SolicitudProveedorResponse(
                solicitud.getId(),
                token,
                expiracion
        );
    }

    private void completarPersonaNatural(
            SolicitudProveedorRequest request,
            SolicitudProveedor solicitud) {

        String nombre = obligatorio(
                request.getNombreCompleto(), "El nombre completo"
        );

        if (nombre.length() > 150) {
            throw new IllegalArgumentException(
                    "El nombre completo supera el máximo permitido."
            );
        }

        String tipoDocumento = obligatorio(
                request.getTipoDocumentoTitular(),
                "El tipo de documento del titular"
        );

        tipoDocumento = validarTipoDocumento(tipoDocumento, "El tipo de documento del titular");

        String numeroDocumento = validarDocumento(
                request.getNumeroDocumentoTitular(),
                "El número de documento del titular"
        );

        solicitud.setNombreCompleto(nombre);
        solicitud.setTipoDocumentoTitular(tipoDocumento);
        solicitud.setNumeroDocumentoTitular(numeroDocumento);
    }

    private void completarPersonaJuridica(
            SolicitudProveedorRequest request,
            SolicitudProveedor solicitud) {

        String nit = obligatorio(request.getNit(), "El NIT");

        if (!NUMERO_PATTERN.matcher(nit).matches()
                || nit.length() != 9) {
            throw new IllegalArgumentException(
                    "El NIT debe contener los 9 dígitos anteriores al dígito de verificación."
            );
        }

        String dv = obligatorio(
                request.getDigitoVerificacion(),
                "El dígito de verificación"
        );

        if (!dv.matches("^[0-9]$")) {
            throw new IllegalArgumentException(
                    "El dígito de verificación debe ser un número entre 0 y 9."
            );
        }

        String razonSocial = obligatorio(
                request.getRazonSocial(), "La razón social"
        );

        if (razonSocial.length() > 150) {
            throw new IllegalArgumentException(
                    "La razón social supera el máximo permitido."
            );
        }

        String representante = obligatorio(
                request.getNombreRepresentante(),
                "El nombre del representante legal"
        );

        if (representante.length() > 150) {
            throw new IllegalArgumentException(
                    "El nombre del representante supera el máximo permitido."
            );
        }

        String tipoDocumento = obligatorio(
                request.getTipoDocumentoRepresentante(),
                "El tipo de documento del representante"
        );

        tipoDocumento = validarTipoDocumento(tipoDocumento, "El tipo de documento del representante");

        String numeroDocumento = validarDocumento(
                request.getNumeroDocumentoRepresentante(),
                "El documento del representante"
        );

        solicitud.setNit(nit);
        solicitud.setDigitoVerificacion(dv);
        solicitud.setRazonSocial(razonSocial);
        solicitud.setNombreRepresentante(representante);
        solicitud.setTipoDocumentoRepresentante(tipoDocumento);
        solicitud.setNumeroDocumentoRepresentante(numeroDocumento);
    }

    private String validarTipoDocumento(String valor, String campo) {
        String tipo = obligatorio(valor, campo).toUpperCase(Locale.ROOT);

        if (!TIPOS_DOCUMENTO_PERMITIDOS.contains(tipo)) {
            throw new IllegalArgumentException(
                    campo + " debe ser CC, CE o PPT."
            );
        }

        return tipo;
    }

    private String validarDocumento(String valor, String campo) {
        String documento = obligatorio(valor, campo);

        if (!DOCUMENTO_PATTERN.matcher(documento).matches()) {
            throw new IllegalArgumentException(
                    campo + " tiene un formato inválido."
            );
        }

        return documento;
    }

    private String obligatorio(String valor, String campo) {
        if (valor == null || valor.isBlank()) {
            throw new IllegalArgumentException(
                    campo + " es obligatorio."
            );
        }

        return valor.trim();
    }

    private String generarTokenSeguro() {
        byte[] bytes = new byte[32];
        SECURE_RANDOM.nextBytes(bytes);

        return Base64.getUrlEncoder()
                .withoutPadding()
                .encodeToString(bytes);
    }

    private String calcularHash(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            byte[] hash = digest.digest(
                    token.getBytes(StandardCharsets.UTF_8)
            );

            return HexFormat.of().formatHex(hash);

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "No fue posible generar el hash del token.", e
            );
        }
    }
}
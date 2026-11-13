package eventrix_api.service;

import eventrix_api.model.DocumentoSolicitudProveedor;
import eventrix_api.model.SolicitudProveedor;
import eventrix_api.repository.DocumentoSolicitudProveedorRepository;
import eventrix_api.repository.SolicitudProveedorRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardOpenOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Base64;
import java.util.HashSet;
import java.util.HexFormat;
import java.util.List;
import java.util.Locale;
import java.util.Set;
import java.util.UUID;

@Service
public class CargaDocumentoSolicitudService {

    private static final long TAMANO_MAXIMO = 10L * 1024 * 1024;

    private final SolicitudProveedorRepository solicitudRepository;
    private final DocumentoSolicitudProveedorRepository documentoRepository;
    private final Path directorioDocumentos;

    public CargaDocumentoSolicitudService(
            SolicitudProveedorRepository solicitudRepository,
            DocumentoSolicitudProveedorRepository documentoRepository,
            @Value("${eventrix.documentos.directorio:C:/eventrix-documentos}")
            String directorioDocumentos) {

        this.solicitudRepository = solicitudRepository;
        this.documentoRepository = documentoRepository;
        this.directorioDocumentos = Paths.get(directorioDocumentos)
                .toAbsolutePath()
                .normalize();
    }

    @Transactional
    public int cargarDocumentos(
            String token,
            List<String> tipos,
            List<MultipartFile> archivos) {

        if (token == null || token.isBlank()) {
            throw new IllegalArgumentException("El enlace de carga no es válido.");
        }

        if (tipos == null || archivos == null
                || tipos.isEmpty() || tipos.size() != archivos.size()) {
            throw new IllegalArgumentException(
                    "Debes seleccionar todos los documentos requeridos."
            );
        }

        String tokenHash = sha256(
                token.getBytes(java.nio.charset.StandardCharsets.UTF_8)
        );

        SolicitudProveedor solicitud = solicitudRepository
                .findByTokenCargaHash(tokenHash)
                .orElseThrow(() -> new IllegalArgumentException(
                        "El enlace de carga no existe o no es válido."
                ));

        LocalDateTime ahora = LocalDateTime.now();

        if (solicitud.getTokenCargaExpira() == null
                || !solicitud.getTokenCargaExpira().isAfter(ahora)) {
            throw new IllegalArgumentException(
                    "El enlace de carga ha vencido. Contacta a EVENTRIX."
            );
        }

        if (solicitud.getEstadoSolicitud()
                != SolicitudProveedor.EstadoSolicitud.RECIBIDA) {
            throw new IllegalArgumentException(
                    "Esta solicitud ya no permite cargar documentos."
            );
        }

        if (documentoRepository.countBySolicitud_Id(solicitud.getId()) > 0) {
            throw new IllegalArgumentException(
                    "Esta solicitud ya tiene documentos cargados."
            );
        }

        Set<DocumentoSolicitudProveedor.TipoDocumento> requeridos =
                solicitud.getTipoPersona()
                        == SolicitudProveedor.TipoPersona.NATURAL
                ? Set.of(
                        DocumentoSolicitudProveedor.TipoDocumento.CEDULA_TITULAR,
                        DocumentoSolicitudProveedor.TipoDocumento.RUT
                )
                : Set.of(
                        DocumentoSolicitudProveedor.TipoDocumento.RUT,
                        DocumentoSolicitudProveedor.TipoDocumento.CAMARA_COMERCIO,
                        DocumentoSolicitudProveedor.TipoDocumento.CEDULA_REPRESENTANTE
                );

        if (archivos.size() != requeridos.size()) {
            throw new IllegalArgumentException(
                    "Debes cargar exactamente todos los documentos requeridos."
            );
        }

        List<DocumentoSolicitudProveedor.TipoDocumento> tiposConvertidos =
                new ArrayList<>();

        Set<DocumentoSolicitudProveedor.TipoDocumento> tiposUnicos =
                new HashSet<>();

        for (String tipo : tipos) {
            try {
                DocumentoSolicitudProveedor.TipoDocumento convertido =
                        DocumentoSolicitudProveedor.TipoDocumento.valueOf(
                                tipo.trim().toUpperCase(Locale.ROOT)
                        );

                if (!requeridos.contains(convertido)
                        || !tiposUnicos.add(convertido)) {
                    throw new IllegalArgumentException(
                            "Hay documentos duplicados o no correspondientes."
                    );
                }

                tiposConvertidos.add(convertido);

            } catch (IllegalArgumentException e) {
                throw new IllegalArgumentException(
                        "Uno de los tipos de documento no es válido."
                );
            }
        }

        if (!tiposUnicos.equals(requeridos)) {
            throw new IllegalArgumentException(
                    "Faltan documentos obligatorios para este tipo de proveedor."
            );
        }

        List<Path> archivosGuardados = new ArrayList<>();

        try {
            Path carpetaSolicitud = directorioDocumentos
                    .resolve("solicitudes")
                    .resolve(String.valueOf(solicitud.getId()))
                    .normalize();

            if (!carpetaSolicitud.startsWith(directorioDocumentos)) {
                throw new IllegalStateException(
                        "No se pudo determinar la ubicación de almacenamiento."
                );
            }

            Files.createDirectories(carpetaSolicitud);

            List<DocumentoSolicitudProveedor> documentos =
                    new ArrayList<>();

            for (int i = 0; i < archivos.size(); i++) {

                MultipartFile archivo = archivos.get(i);

                if (archivo == null || archivo.isEmpty()) {
                    throw new IllegalArgumentException(
                            "Uno de los documentos está vacío."
                    );
                }

                if (archivo.getSize() > TAMANO_MAXIMO) {
                    throw new IllegalArgumentException(
                            "Cada documento debe pesar máximo 10 MB."
                    );
                }

                byte[] contenido = archivo.getBytes();

                String nombreOriginal = obtenerNombreSeguro(
                        archivo.getOriginalFilename()
                );

                String extension = obtenerExtension(nombreOriginal);

                String mime = detectarMime(contenido);

                if (!extension.equals(mime.equals("application/pdf")
                        ? "pdf"
                        : mime.equals("image/jpeg") ? "jpg" : "png")) {
                    throw new IllegalArgumentException(
                            "La extensión del archivo no coincide con su contenido real."
                    );
                }

                String nombreAlmacenado =
                        UUID.randomUUID() + "." + extension;

                Path destino = carpetaSolicitud
                        .resolve(nombreAlmacenado)
                        .normalize();

                if (!destino.startsWith(carpetaSolicitud)) {
                    throw new IllegalStateException(
                            "No se pudo guardar el documento de forma segura."
                    );
                }

                Files.write(
                        destino,
                        contenido,
                        StandardOpenOption.CREATE_NEW,
                        StandardOpenOption.WRITE
                );

                archivosGuardados.add(destino);

                DocumentoSolicitudProveedor documento =
                        new DocumentoSolicitudProveedor();

                documento.setSolicitud(solicitud);
                documento.setTipoDocumento(tiposConvertidos.get(i));
                documento.setNombreArchivo(nombreOriginal);
                documento.setNombreArchivoAlmacenado(nombreAlmacenado);
                documento.setRutaAlmacenamiento(destino.toString());
                documento.setTipoMime(mime);
                documento.setTamanoBytes((long) contenido.length);
                documento.setHashSha256(sha256(contenido));
                documento.setEstadoDocumento(
                        DocumentoSolicitudProveedor.EstadoDocumento.CARGADO
                );

                documentos.add(documento);
            }

            documentoRepository.saveAllAndFlush(documentos);

            solicitud.setEstadoSolicitud(
                    SolicitudProveedor.EstadoSolicitud.PENDIENTE_REVISION_ADMIN
            );

            solicitud.setTokenCargaExpira(ahora);

            solicitudRepository.saveAndFlush(solicitud);

            return documentos.size();

        } catch (IOException e) {
            eliminarArchivos(archivosGuardados);

            throw new IllegalStateException(
                    "No fue posible almacenar los documentos."
            );

        } catch (RuntimeException e) {
            eliminarArchivos(archivosGuardados);
            throw e;
        }
    }

    private String obtenerNombreSeguro(String nombre) {

        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException(
                    "Uno de los archivos no tiene nombre válido."
            );
        }

        String limpio = nombre.replace('\\', '/');

        limpio = limpio.substring(limpio.lastIndexOf('/') + 1)
                .replaceAll("[\\p{Cntrl}]", "")
                .trim();

        if (limpio.isBlank() || limpio.length() > 255) {
            throw new IllegalArgumentException(
                    "El nombre de uno de los archivos no es válido."
            );
        }

        return limpio;
    }

    private String obtenerExtension(String nombre) {

        int punto = nombre.lastIndexOf('.');

        if (punto < 0) {
            throw new IllegalArgumentException(
                    "Solo se permiten archivos PDF, JPG y PNG."
            );
        }

        String extension = nombre.substring(punto + 1)
                .toLowerCase(Locale.ROOT);

        if (!Set.of("pdf", "jpg", "jpeg", "png").contains(extension)) {
            throw new IllegalArgumentException(
                    "Solo se permiten archivos PDF, JPG y PNG."
            );
        }

        return extension.equals("jpeg") ? "jpg" : extension;
    }

    private String detectarMime(byte[] contenido) {

        if (contenido.length >= 5
                && contenido[0] == '%'
                && contenido[1] == 'P'
                && contenido[2] == 'D'
                && contenido[3] == 'F'
                && contenido[4] == '-') {
            return "application/pdf";
        }

        if (contenido.length >= 3
                && (contenido[0] & 0xFF) == 0xFF
                && (contenido[1] & 0xFF) == 0xD8
                && (contenido[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }

        byte[] firmaPng = {
                (byte) 0x89, 0x50, 0x4E, 0x47,
                0x0D, 0x0A, 0x1A, 0x0A
        };

        if (contenido.length >= firmaPng.length) {
            boolean coincide = true;

            for (int i = 0; i < firmaPng.length; i++) {
                if (contenido[i] != firmaPng[i]) {
                    coincide = false;
                    break;
                }
            }

            if (coincide) {
                return "image/png";
            }
        }

        throw new IllegalArgumentException(
                "El contenido del archivo no corresponde a un PDF, JPG o PNG válido."
        );
    }

    private String sha256(byte[] contenido) {

        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");

            return HexFormat.of().formatHex(
                    digest.digest(contenido)
            );

        } catch (NoSuchAlgorithmException e) {
            throw new IllegalStateException(
                    "No fue posible calcular la huella del archivo."
            );
        }
    }

    private void eliminarArchivos(List<Path> archivos) {

        for (Path archivo : archivos) {
            try {
                Files.deleteIfExists(archivo);
            } catch (IOException ignored) {
                // No ocultar el error original.
            }
        }
    }
}
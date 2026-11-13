package eventrix_api.service;

import eventrix_api.model.DocumentoProveedor;
import eventrix_api.model.PerfilProveedor;
import eventrix_api.repository.DocumentoProveedorRepository;
import eventrix_api.repository.PerfilProveedorRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.MessageDigest;
import java.util.HexFormat;
import java.util.Locale;
import java.util.UUID;

@Service
public class DocumentoProveedorService {

    private static final long TAMANO_MAXIMO = 10L * 1024 * 1024;

    private final DocumentoProveedorRepository documentoRepository;
    private final PerfilProveedorRepository perfilRepository;
    private final Path directorioBase;

    public DocumentoProveedorService(
            DocumentoProveedorRepository documentoRepository,
            PerfilProveedorRepository perfilRepository,
            @Value("${eventrix.documentos.directorio}") String directorio
    ) {
        this.documentoRepository = documentoRepository;
        this.perfilRepository = perfilRepository;
        this.directorioBase = Paths.get(directorio).toAbsolutePath().normalize();
    }

    @Transactional
    public DocumentoProveedor cargarDocumento(
            Integer idUsuario,
            DocumentoProveedor.TipoDocumento tipoDocumento,
            MultipartFile archivo
    ) throws IOException {

        if (tipoDocumento == null) {
            throw new IllegalArgumentException("Debe indicar el tipo de documento.");
        }

        if (archivo == null || archivo.isEmpty()) {
            throw new IllegalArgumentException("Debe seleccionar un archivo.");
        }

        if (archivo.getSize() > TAMANO_MAXIMO) {
            throw new IllegalArgumentException("El archivo supera el límite de 10 MB.");
        }

        PerfilProveedor perfil = perfilRepository.findByUsuario_Id(idUsuario)
                .orElseThrow(() -> new IllegalArgumentException(
                        "Primero debe registrar su perfil de proveedor."
                ));

        validarTipoDocumento(perfil, tipoDocumento);

        if (documentoRepository.existsByPerfilProveedor_IdAndTipoDocumento(
                perfil.getId(), tipoDocumento)) {
            throw new IllegalArgumentException(
                    "Ya existe un documento cargado de este tipo."
            );
        }

        byte[] contenido = archivo.getBytes();
        String tipoMime = detectarTipoMime(contenido);

        if (tipoMime == null) {
            throw new IllegalArgumentException(
                    "Formato no permitido. Solo se aceptan PDF, JPG y PNG."
            );
        }

        String nombreOriginal = Paths.get(
                archivo.getOriginalFilename() == null
                        ? "documento"
                        : archivo.getOriginalFilename()
        ).getFileName().toString();

        if (nombreOriginal.isBlank()) {
            nombreOriginal = "documento";
        }

        String extension = extensionPara(tipoMime);
        String nombreAlmacenado = UUID.randomUUID() + extension;

        Path directorioPerfil = directorioBase.resolve(
                "perfil-" + perfil.getId()
        ).normalize();

        if (!directorioPerfil.startsWith(directorioBase)) {
            throw new IllegalArgumentException("Ruta de almacenamiento no válida.");
        }

        Files.createDirectories(directorioPerfil);

        Path rutaArchivo = directorioPerfil.resolve(nombreAlmacenado).normalize();

        if (!rutaArchivo.startsWith(directorioPerfil)) {
            throw new IllegalArgumentException("Nombre de archivo no válido.");
        }

        String hash = calcularHash(contenido);

        DocumentoProveedor documento = new DocumentoProveedor();
        documento.setPerfilProveedor(perfil);
        documento.setTipoDocumento(tipoDocumento);
        documento.setNombreArchivo(nombreOriginal);
        documento.setNombreArchivoAlmacenado(nombreAlmacenado);
        documento.setRutaAlmacenamiento(rutaArchivo.toString());
        documento.setTipoMime(tipoMime);
        documento.setTamanoBytes((long) contenido.length);
        documento.setHashSha256(hash);
        documento.setEstadoDocumento(DocumentoProveedor.EstadoDocumento.CARGADO);

        Files.write(rutaArchivo, contenido);

        try {
            return documentoRepository.saveAndFlush(documento);
        } catch (RuntimeException ex) {
            Files.deleteIfExists(rutaArchivo);
            throw ex;
        }
    }

    private void validarTipoDocumento(
            PerfilProveedor perfil,
            DocumentoProveedor.TipoDocumento tipoDocumento
    ) {
        boolean permitido;

        if (perfil.getTipoPersona() == PerfilProveedor.TipoPersona.NATURAL) {
            permitido = tipoDocumento == DocumentoProveedor.TipoDocumento.CEDULA_TITULAR
                    || tipoDocumento == DocumentoProveedor.TipoDocumento.RUT;
        } else {
            permitido = tipoDocumento == DocumentoProveedor.TipoDocumento.RUT
                    || tipoDocumento == DocumentoProveedor.TipoDocumento.CAMARA_COMERCIO
                    || tipoDocumento == DocumentoProveedor.TipoDocumento.CEDULA_REPRESENTANTE;
        }

        if (!permitido) {
            throw new IllegalArgumentException(
                    "El tipo de documento no corresponde al tipo de persona registrado."
            );
        }
    }

    private String detectarTipoMime(byte[] contenido) {
        if (contenido.length >= 5
                && contenido[0] == '%'
                && contenido[1] == 'P'
                && contenido[2] == 'D'
                && contenido[3] == 'F'
                && contenido[4] == '-') {
            return "application/pdf";
        }

        if (contenido.length >= 8
                && (contenido[0] & 0xFF) == 0x89
                && contenido[1] == 'P'
                && contenido[2] == 'N'
                && contenido[3] == 'G'
                && contenido[4] == 0x0D
                && contenido[5] == 0x0A
                && contenido[6] == 0x1A
                && contenido[7] == 0x0A) {
            return "image/png";
        }

        if (contenido.length >= 3
                && (contenido[0] & 0xFF) == 0xFF
                && (contenido[1] & 0xFF) == 0xD8
                && (contenido[2] & 0xFF) == 0xFF) {
            return "image/jpeg";
        }

        return null;
    }

    private String extensionPara(String tipoMime) {
        return switch (tipoMime.toLowerCase(Locale.ROOT)) {
            case "application/pdf" -> ".pdf";
            case "image/png" -> ".png";
            case "image/jpeg" -> ".jpg";
            default -> throw new IllegalArgumentException("Formato no permitido.");
        };
    }

    private String calcularHash(byte[] contenido) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            return HexFormat.of().formatHex(digest.digest(contenido));
        } catch (Exception ex) {
            throw new IllegalStateException("No fue posible calcular el hash del documento.", ex);
        }
    }
}

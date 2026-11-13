package eventrix_api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "documento_solicitud_proveedor")
public class DocumentoSolicitudProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_documento")
    private Integer id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_solicitud", nullable = false)
    private SolicitudProveedor solicitud;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_documento", nullable = false)
    private TipoDocumento tipoDocumento;

    @Column(name = "nombre_archivo", nullable = false, length = 255)
    private String nombreArchivo;

    @Column(name = "nombre_archivo_almacenado", nullable = false, length = 255)
    private String nombreArchivoAlmacenado;

    @Column(name = "ruta_almacenamiento", nullable = false, length = 500)
    private String rutaAlmacenamiento;

    @Column(name = "tipo_mime", nullable = false, length = 100)
    private String tipoMime;

    @Column(name = "tamano_bytes", nullable = false)
    private Long tamanoBytes;

    @Column(name = "hash_sha256", nullable = false, length = 64)
    private String hashSha256;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_documento", nullable = false)
    private EstadoDocumento estadoDocumento = EstadoDocumento.CARGADO;

    @Column(name = "observaciones", columnDefinition = "TEXT")
    private String observaciones;

    @Column(name = "fecha_carga", insertable = false, updatable = false)
    private LocalDateTime fechaCarga;

    @Column(name = "fecha_actualizacion", insertable = false, updatable = false)
    private LocalDateTime fechaActualizacion;

    public DocumentoSolicitudProveedor() {
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public SolicitudProveedor getSolicitud() { return solicitud; }
    public void setSolicitud(SolicitudProveedor solicitud) { this.solicitud = solicitud; }

    public TipoDocumento getTipoDocumento() { return tipoDocumento; }
    public void setTipoDocumento(TipoDocumento tipoDocumento) { this.tipoDocumento = tipoDocumento; }

    public String getNombreArchivo() { return nombreArchivo; }
    public void setNombreArchivo(String nombreArchivo) { this.nombreArchivo = nombreArchivo; }

    public String getNombreArchivoAlmacenado() { return nombreArchivoAlmacenado; }
    public void setNombreArchivoAlmacenado(String nombreArchivoAlmacenado) { this.nombreArchivoAlmacenado = nombreArchivoAlmacenado; }

    public String getRutaAlmacenamiento() { return rutaAlmacenamiento; }
    public void setRutaAlmacenamiento(String rutaAlmacenamiento) { this.rutaAlmacenamiento = rutaAlmacenamiento; }

    public String getTipoMime() { return tipoMime; }
    public void setTipoMime(String tipoMime) { this.tipoMime = tipoMime; }

    public Long getTamanoBytes() { return tamanoBytes; }
    public void setTamanoBytes(Long tamanoBytes) { this.tamanoBytes = tamanoBytes; }

    public String getHashSha256() { return hashSha256; }
    public void setHashSha256(String hashSha256) { this.hashSha256 = hashSha256; }

    public EstadoDocumento getEstadoDocumento() { return estadoDocumento; }
    public void setEstadoDocumento(EstadoDocumento estadoDocumento) { this.estadoDocumento = estadoDocumento; }

    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }

    public LocalDateTime getFechaCarga() { return fechaCarga; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }

    public enum TipoDocumento {
        CEDULA_TITULAR,
        RUT,
        CAMARA_COMERCIO,
        CEDULA_REPRESENTANTE
    }

    public enum EstadoDocumento {
        CARGADO,
        EN_REVISION,
        APROBADO,
        RECHAZADO
    }
}
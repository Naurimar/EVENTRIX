package eventrix_api.model;

import jakarta.persistence.*;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "solicitud_proveedor")
public class SolicitudProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_solicitud")
    private Integer id;

    @Column(name = "correo", nullable = false, length = 150)
    private String correo;

    @Column(name = "token_carga_hash", nullable = false, unique = true, length = 64)
    private String tokenCargaHash;

    @Column(name = "token_carga_expira")
    private LocalDateTime tokenCargaExpira;

    @Enumerated(EnumType.STRING)
    @Column(name = "tipo_persona", nullable = false)
    private TipoPersona tipoPersona;

    @Column(name = "nombre_completo", length = 150)
    private String nombreCompleto;

    @Column(name = "tipo_documento_titular", length = 20)
    private String tipoDocumentoTitular;

    @Column(name = "numero_documento_titular", length = 30)
    private String numeroDocumentoTitular;

    @Column(name = "nit", length = 20)
    private String nit;

    @Column(name = "digito_verificacion", length = 1)
    private String digitoVerificacion;

    @Column(name = "razon_social", length = 150)
    private String razonSocial;

    @Column(name = "nombre_representante", length = 150)
    private String nombreRepresentante;

    @Column(name = "tipo_documento_representante", length = 20)
    private String tipoDocumentoRepresentante;

    @Column(name = "numero_documento_representante", length = 30)
    private String numeroDocumentoRepresentante;

    @Column(name = "telefono_contacto", length = 30)
    private String telefonoContacto;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_solicitud", nullable = false)
    private EstadoSolicitud estadoSolicitud = EstadoSolicitud.RECIBIDA;

    @Enumerated(EnumType.STRING)
    @Column(name = "estado_analisis_ia", nullable = false)
    private EstadoAnalisisIA estadoAnalisisIA = EstadoAnalisisIA.PENDIENTE;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "resultado_analisis_ia", columnDefinition = "json")
    private String resultadoAnalisisIA;

    @Column(name = "observaciones_admin", columnDefinition = "TEXT")
    private String observacionesAdmin;

    @Column(name = "motivo_rechazo", columnDefinition = "TEXT")
    private String motivoRechazo;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario_creado", unique = true)
    private Usuario usuarioCreado;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_administrador_decision")
    private Usuario administradorDecision;

    @Column(name = "fecha_decision", insertable = false, updatable = false)
    private LocalDateTime fechaDecision;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", insertable = false, updatable = false)
    private LocalDateTime fechaActualizacion;

    public SolicitudProveedor() {
    }

    public Integer getId() { return id; }
    public void setId(Integer id) { this.id = id; }

    public String getCorreo() { return correo; }
    public void setCorreo(String correo) { this.correo = correo; }

    public String getTokenCargaHash() { return tokenCargaHash; }
    public void setTokenCargaHash(String tokenCargaHash) { this.tokenCargaHash = tokenCargaHash; }

    public LocalDateTime getTokenCargaExpira() { return tokenCargaExpira; }
    public void setTokenCargaExpira(LocalDateTime tokenCargaExpira) { this.tokenCargaExpira = tokenCargaExpira; }

    public TipoPersona getTipoPersona() { return tipoPersona; }
    public void setTipoPersona(TipoPersona tipoPersona) { this.tipoPersona = tipoPersona; }

    public String getNombreCompleto() { return nombreCompleto; }
    public void setNombreCompleto(String nombreCompleto) { this.nombreCompleto = nombreCompleto; }

    public String getTipoDocumentoTitular() { return tipoDocumentoTitular; }
    public void setTipoDocumentoTitular(String tipoDocumentoTitular) { this.tipoDocumentoTitular = tipoDocumentoTitular; }

    public String getNumeroDocumentoTitular() { return numeroDocumentoTitular; }
    public void setNumeroDocumentoTitular(String numeroDocumentoTitular) { this.numeroDocumentoTitular = numeroDocumentoTitular; }

    public String getNit() { return nit; }
    public void setNit(String nit) { this.nit = nit; }

    public String getDigitoVerificacion() { return digitoVerificacion; }
    public void setDigitoVerificacion(String digitoVerificacion) { this.digitoVerificacion = digitoVerificacion; }

    public String getRazonSocial() { return razonSocial; }
    public void setRazonSocial(String razonSocial) { this.razonSocial = razonSocial; }

    public String getNombreRepresentante() { return nombreRepresentante; }
    public void setNombreRepresentante(String nombreRepresentante) { this.nombreRepresentante = nombreRepresentante; }

    public String getTipoDocumentoRepresentante() { return tipoDocumentoRepresentante; }
    public void setTipoDocumentoRepresentante(String tipoDocumentoRepresentante) { this.tipoDocumentoRepresentante = tipoDocumentoRepresentante; }

    public String getNumeroDocumentoRepresentante() { return numeroDocumentoRepresentante; }
    public void setNumeroDocumentoRepresentante(String numeroDocumentoRepresentante) { this.numeroDocumentoRepresentante = numeroDocumentoRepresentante; }

    public String getTelefonoContacto() { return telefonoContacto; }
    public void setTelefonoContacto(String telefonoContacto) { this.telefonoContacto = telefonoContacto; }

    public EstadoSolicitud getEstadoSolicitud() { return estadoSolicitud; }
    public void setEstadoSolicitud(EstadoSolicitud estadoSolicitud) { this.estadoSolicitud = estadoSolicitud; }

    public EstadoAnalisisIA getEstadoAnalisisIA() { return estadoAnalisisIA; }
    public void setEstadoAnalisisIA(EstadoAnalisisIA estadoAnalisisIA) { this.estadoAnalisisIA = estadoAnalisisIA; }

    public String getResultadoAnalisisIA() { return resultadoAnalisisIA; }
    public void setResultadoAnalisisIA(String resultadoAnalisisIA) { this.resultadoAnalisisIA = resultadoAnalisisIA; }

    public String getObservacionesAdmin() { return observacionesAdmin; }
    public void setObservacionesAdmin(String observacionesAdmin) { this.observacionesAdmin = observacionesAdmin; }

    public String getMotivoRechazo() { return motivoRechazo; }
    public void setMotivoRechazo(String motivoRechazo) { this.motivoRechazo = motivoRechazo; }

    public Usuario getUsuarioCreado() { return usuarioCreado; }
    public void setUsuarioCreado(Usuario usuarioCreado) { this.usuarioCreado = usuarioCreado; }

    public Usuario getAdministradorDecision() { return administradorDecision; }
    public void setAdministradorDecision(Usuario administradorDecision) { this.administradorDecision = administradorDecision; }

    public LocalDateTime getFechaDecision() { return fechaDecision; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public LocalDateTime getFechaActualizacion() { return fechaActualizacion; }

    public enum TipoPersona {
        NATURAL,
        JURIDICA
    }

    public enum EstadoSolicitud {
        RECIBIDA,
        EN_REVISION_IA,
        PENDIENTE_REVISION_ADMIN,
        APROBADA,
        RECHAZADA
    }

    public enum EstadoAnalisisIA {
        PENDIENTE,
        EN_PROCESO,
        COMPLETADO,
        ERROR
    }
}
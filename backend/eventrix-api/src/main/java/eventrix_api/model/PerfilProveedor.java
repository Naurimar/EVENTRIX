package eventrix_api.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "perfil_proveedor")
public class PerfilProveedor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_perfil")
    private Integer id;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "id_usuario", nullable = false, unique = true)
    private Usuario usuario;

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
    @Column(name = "estado_verificacion", nullable = false)
    private EstadoVerificacion estadoVerificacion = EstadoVerificacion.PENDIENTE;

    @Column(name = "fecha_creacion", insertable = false, updatable = false)
    private LocalDateTime fechaCreacion;

    @Column(name = "fecha_actualizacion", insertable = false, updatable = false)
    private LocalDateTime fechaActualizacion;

    public PerfilProveedor() {
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Usuario getUsuario() {
        return usuario;
    }

    public void setUsuario(Usuario usuario) {
        this.usuario = usuario;
    }

    public TipoPersona getTipoPersona() {
        return tipoPersona;
    }

    public void setTipoPersona(TipoPersona tipoPersona) {
        this.tipoPersona = tipoPersona;
    }

    public String getNombreCompleto() {
        return nombreCompleto;
    }

    public void setNombreCompleto(String nombreCompleto) {
        this.nombreCompleto = nombreCompleto;
    }

    public String getTipoDocumentoTitular() {
        return tipoDocumentoTitular;
    }

    public void setTipoDocumentoTitular(String tipoDocumentoTitular) {
        this.tipoDocumentoTitular = tipoDocumentoTitular;
    }

    public String getNumeroDocumentoTitular() {
        return numeroDocumentoTitular;
    }

    public void setNumeroDocumentoTitular(String numeroDocumentoTitular) {
        this.numeroDocumentoTitular = numeroDocumentoTitular;
    }

    public String getNit() {
        return nit;
    }

    public void setNit(String nit) {
        this.nit = nit;
    }

    public String getDigitoVerificacion() {
        return digitoVerificacion;
    }

    public void setDigitoVerificacion(String digitoVerificacion) {
        this.digitoVerificacion = digitoVerificacion;
    }

    public String getRazonSocial() {
        return razonSocial;
    }

    public void setRazonSocial(String razonSocial) {
        this.razonSocial = razonSocial;
    }

    public String getNombreRepresentante() {
        return nombreRepresentante;
    }

    public void setNombreRepresentante(String nombreRepresentante) {
        this.nombreRepresentante = nombreRepresentante;
    }

    public String getTipoDocumentoRepresentante() {
        return tipoDocumentoRepresentante;
    }

    public void setTipoDocumentoRepresentante(String tipoDocumentoRepresentante) {
        this.tipoDocumentoRepresentante = tipoDocumentoRepresentante;
    }

    public String getNumeroDocumentoRepresentante() {
        return numeroDocumentoRepresentante;
    }

    public void setNumeroDocumentoRepresentante(String numeroDocumentoRepresentante) {
        this.numeroDocumentoRepresentante = numeroDocumentoRepresentante;
    }

    public String getTelefonoContacto() {
        return telefonoContacto;
    }

    public void setTelefonoContacto(String telefonoContacto) {
        this.telefonoContacto = telefonoContacto;
    }

    public EstadoVerificacion getEstadoVerificacion() {
        return estadoVerificacion;
    }

    public void setEstadoVerificacion(EstadoVerificacion estadoVerificacion) {
        this.estadoVerificacion = estadoVerificacion;
    }

    public LocalDateTime getFechaCreacion() {
        return fechaCreacion;
    }

    public LocalDateTime getFechaActualizacion() {
        return fechaActualizacion;
    }

    public enum TipoPersona {
        NATURAL,
        JURIDICA
    }

    public enum EstadoVerificacion {
        PENDIENTE,
        EN_REVISION,
        APROBADO,
        RECHAZADO
    }
}

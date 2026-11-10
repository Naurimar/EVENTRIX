package eventrix_api.model;

import java.math.BigDecimal;

public class Proveedor {

    private Integer idProveedor;
    private String nombre;
    private String telefono;
    private String correo;
    private BigDecimal calificacion;
    private Boolean activo;
    private Integer idTipo;
    private String nombreTipo;

    public Proveedor() {
    }

    public Proveedor(
            Integer idProveedor,
            String nombre,
            String telefono,
            String correo,
            BigDecimal calificacion,
            Boolean activo,
            Integer idTipo,
            String nombreTipo) {
        this.idProveedor = idProveedor;
        this.nombre = nombre;
        this.telefono = telefono;
        this.correo = correo;
        this.calificacion = calificacion;
        this.activo = activo;
        this.idTipo = idTipo;
        this.nombreTipo = nombreTipo;
    }

    public Integer getIdProveedor() {
        return idProveedor;
    }

    public void setIdProveedor(Integer idProveedor) {
        this.idProveedor = idProveedor;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public BigDecimal getCalificacion() {
        return calificacion;
    }

    public void setCalificacion(BigDecimal calificacion) {
        this.calificacion = calificacion;
    }

    public Boolean getActivo() {
        return activo;
    }

    public void setActivo(Boolean activo) {
        this.activo = activo;
    }

    public Integer getIdTipo() {
        return idTipo;
    }

    public void setIdTipo(Integer idTipo) {
        this.idTipo = idTipo;
    }

    public String getNombreTipo() {
        return nombreTipo;
    }

    public void setNombreTipo(String nombreTipo) {
        this.nombreTipo = nombreTipo;
    }
}

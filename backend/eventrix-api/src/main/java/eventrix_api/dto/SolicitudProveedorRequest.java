package eventrix_api.dto;

public class SolicitudProveedorRequest {

    private String correo;
    private String tipoPersona;

    // Persona natural
    private String nombreCompleto;
    private String tipoDocumentoTitular;
    private String numeroDocumentoTitular;

    // Persona juridica
    private String nit;
    private String digitoVerificacion;
    private String razonSocial;
    private String nombreRepresentante;
    private String tipoDocumentoRepresentante;
    private String numeroDocumentoRepresentante;

    private String telefonoContacto;

    public SolicitudProveedorRequest() {
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTipoPersona() {
        return tipoPersona;
    }

    public void setTipoPersona(String tipoPersona) {
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
}
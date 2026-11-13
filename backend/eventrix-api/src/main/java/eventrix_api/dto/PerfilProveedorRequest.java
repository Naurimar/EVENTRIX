package eventrix_api.dto;

import eventrix_api.model.PerfilProveedor;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public class PerfilProveedorRequest {

    @NotNull(message = "Debe indicar si es persona natural o jurídica")
    private PerfilProveedor.TipoPersona tipoPersona;

    @Size(max = 150)
    private String nombreCompleto;

    @Size(max = 20)
    private String tipoDocumentoTitular;

    @Size(max = 30)
    private String numeroDocumentoTitular;

    @Size(max = 20)
    private String nit;

    @Size(max = 1)
    private String digitoVerificacion;

    @Size(max = 150)
    private String razonSocial;

    @Size(max = 150)
    private String nombreRepresentante;

    @Size(max = 20)
    private String tipoDocumentoRepresentante;

    @Size(max = 30)
    private String numeroDocumentoRepresentante;

    @Size(max = 30)
    private String telefonoContacto;

    public PerfilProveedor.TipoPersona getTipoPersona() {
        return tipoPersona;
    }

    public void setTipoPersona(PerfilProveedor.TipoPersona tipoPersona) {
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

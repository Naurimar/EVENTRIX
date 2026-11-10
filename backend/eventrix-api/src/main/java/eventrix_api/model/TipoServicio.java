package eventrix_api.model;

public class TipoServicio {

    private Integer idTipo;
    private String nombreTipo;
    private String descripcion;

    public TipoServicio() {
    }

    public TipoServicio(Integer idTipo, String nombreTipo, String descripcion) {
        this.idTipo = idTipo;
        this.nombreTipo = nombreTipo;
        this.descripcion = descripcion;
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

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
}
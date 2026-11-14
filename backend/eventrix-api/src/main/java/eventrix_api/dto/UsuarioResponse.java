package eventrix_api.dto;

public class UsuarioResponse {

    private Integer id;
    private String nombre;
    private String correo;
    private Boolean estado;
    private String rol;

    public UsuarioResponse(
            Integer id,
            String nombre,
            String correo,
            Boolean estado,
            String rol) {

        this.id = id;
        this.nombre = nombre;
        this.correo = correo;
        this.estado = estado;
        this.rol = rol;
    }

    public Integer getId() {
        return id;
    }

    public String getNombre() {
        return nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public Boolean getEstado() {
        return estado;
    }

    public String getRol() {
        return rol;
    }
}
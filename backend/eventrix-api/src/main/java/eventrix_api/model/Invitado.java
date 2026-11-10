package eventrix_api.model;

public class Invitado {

    private Integer idInvitado;
    private String nombre;
    private String correo;
    private String telefono;
    private String restriccionDietetica;
    private String estadoRsvp;

    public Invitado() {
    }

    public Invitado(Integer idInvitado, String nombre, String correo,
                    String telefono, String restriccionDietetica,
                    String estadoRsvp) {
        this.idInvitado = idInvitado;
        this.nombre = nombre;
        this.correo = correo;
        this.telefono = telefono;
        this.restriccionDietetica = restriccionDietetica;
        this.estadoRsvp = estadoRsvp;
    }

    public Integer getIdInvitado() {
        return idInvitado;
    }

    public void setIdInvitado(Integer idInvitado) {
        this.idInvitado = idInvitado;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getTelefono() {
        return telefono;
    }

    public void setTelefono(String telefono) {
        this.telefono = telefono;
    }

    public String getRestriccionDietetica() {
        return restriccionDietetica;
    }

    public void setRestriccionDietetica(String restriccionDietetica) {
        this.restriccionDietetica = restriccionDietetica;
    }

    public String getEstadoRsvp() {
        return estadoRsvp;
    }

    public void setEstadoRsvp(String estadoRsvp) {
        this.estadoRsvp = estadoRsvp;
    }
}

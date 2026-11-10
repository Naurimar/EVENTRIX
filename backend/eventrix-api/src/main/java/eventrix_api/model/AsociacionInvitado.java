package eventrix_api.model;

public class AsociacionInvitado {

    private Integer idEvento;
    private Integer idInvitado;
    private Integer idMesa;
    private String estadoRsvp;

    public AsociacionInvitado() {
    }

    public Integer getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
    }

    public Integer getIdInvitado() {
        return idInvitado;
    }

    public void setIdInvitado(Integer idInvitado) {
        this.idInvitado = idInvitado;
    }

    public Integer getIdMesa() {
        return idMesa;
    }

    public void setIdMesa(Integer idMesa) {
        this.idMesa = idMesa;
    }

    public String getEstadoRsvp() {
        return estadoRsvp;
    }

    public void setEstadoRsvp(String estadoRsvp) {
        this.estadoRsvp = estadoRsvp;
    }
}

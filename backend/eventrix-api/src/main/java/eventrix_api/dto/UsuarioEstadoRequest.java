package eventrix_api.dto;

import jakarta.validation.constraints.NotNull;

public class UsuarioEstadoRequest {

    @NotNull(message = "El estado es obligatorio")
    private Boolean estado;

    public UsuarioEstadoRequest() {
    }

    public Boolean getEstado() {
        return estado;
    }

    public void setEstado(Boolean estado) {
        this.estado = estado;
    }
}
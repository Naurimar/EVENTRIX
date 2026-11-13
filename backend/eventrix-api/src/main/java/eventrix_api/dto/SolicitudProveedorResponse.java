package eventrix_api.dto;

import java.time.LocalDateTime;

public class SolicitudProveedorResponse {

    private Integer idSolicitud;
    private String tokenCarga;
    private LocalDateTime tokenExpira;

    public SolicitudProveedorResponse(
            Integer idSolicitud,
            String tokenCarga,
            LocalDateTime tokenExpira) {
        this.idSolicitud = idSolicitud;
        this.tokenCarga = tokenCarga;
        this.tokenExpira = tokenExpira;
    }

    public Integer getIdSolicitud() {
        return idSolicitud;
    }

    public String getTokenCarga() {
        return tokenCarga;
    }

    public LocalDateTime getTokenExpira() {
        return tokenExpira;
    }
}
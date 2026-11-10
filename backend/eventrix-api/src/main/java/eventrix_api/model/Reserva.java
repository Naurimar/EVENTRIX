package eventrix_api.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Reserva {

    private Integer idReserva;
    private LocalDateTime fechaInicio;
    private LocalDateTime fechaFin;
    private String estado;
    private BigDecimal costoTotal;
    private Integer idEvento;
    private Integer idEspacio;

    public Reserva() {
    }

    public Reserva(
            Integer idReserva,
            LocalDateTime fechaInicio,
            LocalDateTime fechaFin,
            String estado,
            BigDecimal costoTotal,
            Integer idEvento,
            Integer idEspacio) {

        this.idReserva = idReserva;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.costoTotal = costoTotal;
        this.idEvento = idEvento;
        this.idEspacio = idEspacio;
    }

    public Integer getIdReserva() {
        return idReserva;
    }

    public void setIdReserva(Integer idReserva) {
        this.idReserva = idReserva;
    }

    public LocalDateTime getFechaInicio() {
        return fechaInicio;
    }

    public void setFechaInicio(LocalDateTime fechaInicio) {
        this.fechaInicio = fechaInicio;
    }

    public LocalDateTime getFechaFin() {
        return fechaFin;
    }

    public void setFechaFin(LocalDateTime fechaFin) {
        this.fechaFin = fechaFin;
    }

    public String getEstado() {
        return estado;
    }

    public void setEstado(String estado) {
        this.estado = estado;
    }

    public BigDecimal getCostoTotal() {
        return costoTotal;
    }

    public void setCostoTotal(BigDecimal costoTotal) {
        this.costoTotal = costoTotal;
    }

    public Integer getIdEvento() {
        return idEvento;
    }

    public void setIdEvento(Integer idEvento) {
        this.idEvento = idEvento;
    }

    public Integer getIdEspacio() {
        return idEspacio;
    }

    public void setIdEspacio(Integer idEspacio) {
        this.idEspacio = idEspacio;
    }
}
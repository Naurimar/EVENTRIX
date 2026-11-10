package eventrix_api.model;

import java.math.BigDecimal;
import java.util.Map;

public class ResumenReporte {

    private long totalEventos;
    private BigDecimal presupuestoTotal;
    private BigDecimal presupuestoPromedio;
    private long totalInvitados;

    private Map<String, Object> eventosPorEstado;
    private Map<String, Object> eventosPorTipo;
    private Map<String, Object> eventosPorMes;

    private Map<String, Object> reservas;
    private Map<String, Object> proveedores;
    private Map<String, Object> invitados;

    private Object fechaGeneracion;

    public ResumenReporte(
            long totalEventos,
            BigDecimal presupuestoTotal,
            BigDecimal presupuestoPromedio,
            long totalInvitados,
            Map<String, Object> eventosPorEstado,
            Map<String, Object> eventosPorTipo,
            Map<String, Object> eventosPorMes,
            Map<String, Object> reservas,
            Map<String, Object> proveedores,
            Map<String, Object> invitados,
            Object fechaGeneracion) {

        this.totalEventos = totalEventos;
        this.presupuestoTotal = presupuestoTotal;
        this.presupuestoPromedio = presupuestoPromedio;
        this.totalInvitados = totalInvitados;
        this.eventosPorEstado = eventosPorEstado;
        this.eventosPorTipo = eventosPorTipo;
        this.eventosPorMes = eventosPorMes;
        this.reservas = reservas;
        this.proveedores = proveedores;
        this.invitados = invitados;
        this.fechaGeneracion = fechaGeneracion;
    }

    public long getTotalEventos() {
        return totalEventos;
    }

    public String getPresupuestoTotal() {
        return presupuestoTotal.toPlainString();
    }

    public String getPresupuestoPromedio() {
        return presupuestoPromedio.toPlainString();
    }

    public long getTotalInvitados() {
        return totalInvitados;
    }

    public Map<String, Object> getEventosPorEstado() {
        return eventosPorEstado;
    }

    public Map<String, Object> getEventosPorTipo() {
        return eventosPorTipo;
    }

    public Map<String, Object> getEventosPorMes() {
        return eventosPorMes;
    }

    public Map<String, Object> getReservas() {
        return reservas;
    }

    public Map<String, Object> getProveedores() {
        return proveedores;
    }

    public Map<String, Object> getInvitados() {
        return invitados;
    }

    public Object getFechaGeneracion() {
        return fechaGeneracion;
    }
}

package eventrix_api.model;

import java.math.BigDecimal;

public class ResumenReporte {

    private long totalEventos;
    private BigDecimal presupuestoTotal;
    private BigDecimal presupuestoPromedio;
    private long totalInvitados;

    public ResumenReporte(
            long totalEventos,
            BigDecimal presupuestoTotal,
            BigDecimal presupuestoPromedio,
            long totalInvitados) {

        this.totalEventos = totalEventos;
        this.presupuestoTotal = presupuestoTotal;
        this.presupuestoPromedio = presupuestoPromedio;
        this.totalInvitados = totalInvitados;
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
}
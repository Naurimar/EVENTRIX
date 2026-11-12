
package eventrix_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "evento")
@Getter
@Setter
public class Evento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_evento")
    private Integer idEvento;

    @Column(name = "nombre", nullable = false, length = 120)
    private String nombre;

    @Column(name = "tipo", nullable = false, length = 60)
    private String tipo;

    @Column(name = "fecha", nullable = false)
    private LocalDate fecha;

    @Column(name = "hora_inicio")
    private LocalTime horaInicio;

    @Column(name = "presupuesto", nullable = false,
            precision = 12, scale = 2)
    private BigDecimal presupuesto = BigDecimal.ZERO;

    @Column(name = "estado", nullable = false, length = 30)
    private String estado = "PLANIFICADO";

    @Column(name = "tematica", length = 80)
    private String tematica;

    @Column(name = "num_invitados", nullable = false)
    private Integer numInvitados = 0;

    @Column(name = "id_usuario", nullable = false)
    private Integer idUsuario;

    @Column(name = "id_cliente")
    private Integer idCliente;
}

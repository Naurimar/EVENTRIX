package eventrix_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "ciudad")
@Getter
@Setter
public class Ciudad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_ciudad")
    private Integer idCiudad;

    @Column(name = "nombre_ciudad", nullable = false, length = 80)
    private String nombreCiudad;

    @Column(name = "id_departamento", nullable = false)
    private Integer idDepartamento;

    @Column(name = "codigo_divipola", unique = true, length = 5)
    private String codigoDivipola;
}
package eventrix_api.model;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "departamento")
@Getter
@Setter
public class Departamento {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_departamento")
    private Integer idDepartamento;

    @Column(name = "nombre_departamento", nullable = false, length = 80)
    private String nombreDepartamento;

    @Column(name = "pais", nullable = false, length = 60)
    private String pais;

    @Column(name = "codigo_divipola", unique = true, length = 2)
    private String codigoDivipola;
}
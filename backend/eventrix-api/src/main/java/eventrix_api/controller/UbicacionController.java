
package eventrix_api.controller;

import java.util.List;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/ubicaciones")
public class UbicacionController {

    private final JdbcTemplate jdbc;

    public UbicacionController(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public record Departamento(
        Integer idDepartamento,
        String nombreDepartamento,
        String pais
    ) {}

    public record Ciudad(
        Integer idCiudad,
        String nombreCiudad,
        Integer idDepartamento
    ) {}

    @GetMapping("/departamentos")
    public List<Departamento> listarDepartamentos() {
        return jdbc.query(
            """
            SELECT id_departamento, nombre_departamento, pais
            FROM departamento
            ORDER BY nombre_departamento
            """,
            (rs, fila) -> new Departamento(
                rs.getInt("id_departamento"),
                rs.getString("nombre_departamento"),
                rs.getString("pais")
            )
        );
    }

    @GetMapping("/ciudades")
    public List<Ciudad> listarCiudades(
        @RequestParam(required = false) Integer idDepartamento
    ) {
        String sql = """
            SELECT id_ciudad, nombre_ciudad, id_departamento
            FROM ciudad
            """;

        if (idDepartamento != null) {
            sql += " WHERE id_departamento = ?";
        }

        sql += " ORDER BY nombre_ciudad";

        Object[] parametros = idDepartamento == null
            ? new Object[0]
            : new Object[] { idDepartamento };

        return jdbc.query(
            sql,
            (rs, fila) -> new Ciudad(
                rs.getInt("id_ciudad"),
                rs.getString("nombre_ciudad"),
                rs.getInt("id_departamento")
            ),
            parametros
        );
    }
}

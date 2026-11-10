package eventrix_api.repository;

import eventrix_api.model.TipoServicio;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public class TipoServicioRepository {

    private final JdbcTemplate jdbcTemplate;

    public TipoServicioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public List<TipoServicio> listarTodos() {

        String sql = """
                SELECT
                    id_tipo,
                    nombre_tipo,
                    descripcion
                FROM tipo_servicio
                ORDER BY nombre_tipo
                """;

        return jdbcTemplate.query(sql, (rs, rowNum) ->
                new TipoServicio(
                        rs.getInt("id_tipo"),
                        rs.getString("nombre_tipo"),
                        rs.getString("descripcion")
                )
        );
    }
}
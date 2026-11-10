
package eventrix_api.repository;

import eventrix_api.model.Proveedor;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;
import java.util.Objects;

@Repository
public class ProveedorRepository {

    private final JdbcTemplate jdbcTemplate;

    public ProveedorRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Proveedor> proveedorRowMapper = (rs, rowNum) -> {
        Proveedor proveedor = new Proveedor();

        proveedor.setIdProveedor(rs.getInt("id_proveedor"));
        proveedor.setNombre(rs.getString("nombre"));
        proveedor.setTelefono(rs.getString("telefono"));
        proveedor.setCorreo(rs.getString("correo"));
        proveedor.setCalificacion(rs.getBigDecimal("calificacion"));
        proveedor.setActivo(rs.getBoolean("activo"));
        proveedor.setIdTipo(rs.getInt("id_tipo"));
        proveedor.setNombreTipo(rs.getString("nombre_tipo"));

        return proveedor;
    };

    // CONSULTAR TODOS LOS PROVEEDORES

    public List<Proveedor> listarTodos() {

        String sql = """
                SELECT
                    p.id_proveedor,
                    p.nombre,
                    p.telefono,
                    p.correo,
                    p.calificacion,
                    p.activo,
                    p.id_tipo,
                    t.nombre_tipo
                FROM proveedor p
                INNER JOIN tipo_servicio t
                    ON p.id_tipo = t.id_tipo
                ORDER BY p.nombre
                """;

        return jdbcTemplate.query(sql, proveedorRowMapper);
    }

    // CONSULTAR POR ESTADO

    public List<Proveedor> listarPorEstado(boolean activo) {

        String sql = """
                SELECT
                    p.id_proveedor,
                    p.nombre,
                    p.telefono,
                    p.correo,
                    p.calificacion,
                    p.activo,
                    p.id_tipo,
                    t.nombre_tipo
                FROM proveedor p
                INNER JOIN tipo_servicio t
                    ON p.id_tipo = t.id_tipo
                WHERE p.activo = ?
                ORDER BY p.nombre
                """;

        return jdbcTemplate.query(sql, proveedorRowMapper, activo);
    }

    // CONSULTAR POR IDENTIFICADOR

    public Proveedor buscarPorId(Integer id) {

        String sql = """
                SELECT
                    p.id_proveedor,
                    p.nombre,
                    p.telefono,
                    p.correo,
                    p.calificacion,
                    p.activo,
                    p.id_tipo,
                    t.nombre_tipo
                FROM proveedor p
                INNER JOIN tipo_servicio t
                    ON p.id_tipo = t.id_tipo
                WHERE p.id_proveedor = ?
                """;

        List<Proveedor> resultados = jdbcTemplate.query(sql, proveedorRowMapper, id);

        return resultados.isEmpty() ? null : resultados.get(0);
    }

    // REGISTRAR PROVEEDOR

    public Proveedor registrar(Proveedor proveedor) {

        String sql = """
                INSERT INTO proveedor (
                    nombre,
                    telefono,
                    correo,
                    calificacion,
                    activo,
                    id_tipo
                )
                VALUES (?, ?, ?, NULL, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS);

            statement.setString(1, proveedor.getNombre());
            statement.setString(2, proveedor.getTelefono());
            statement.setString(3, proveedor.getCorreo());
            statement.setBoolean(4, true);
            statement.setInt(5, proveedor.getIdTipo());

            return statement;

        }, keyHolder);

        Number idGenerado = keyHolder.getKey();

        if (idGenerado == null) {
            throw new IllegalStateException(
                    "No fue posible recuperar el identificador del proveedor.");
        }

        return buscarPorId(idGenerado.intValue());
    }

    // EDITAR PROVEEDOR

    public Proveedor actualizar(Integer id, Proveedor proveedor) {

        String sql = """
                UPDATE proveedor
                SET
                    nombre = ?,
                    telefono = ?,
                    correo = ?,
                    id_tipo = ?
                WHERE id_proveedor = ?
                """;

        int filasActualizadas = jdbcTemplate.update(
                sql,
                proveedor.getNombre(),
                proveedor.getTelefono(),
                proveedor.getCorreo(),
                proveedor.getIdTipo(),
                id);

        if (filasActualizadas == 0) {
            return null;
        }

        return buscarPorId(id);
    }

    // ACTIVAR O DESACTIVAR PROVEEDOR

    public boolean cambiarEstado(Integer id, boolean activo) {

        String sql = """
                UPDATE proveedor
                SET activo = ?
                WHERE id_proveedor = ?
                """;

        return jdbcTemplate.update(sql, activo, id) > 0;
    }

    // VERIFICAR SI EL PROVEEDOR TIENE EVENTOS ASOCIADOS
    public boolean tieneEventosAsociados(Integer id) {
        String sql = """
                SELECT COUNT(*)
                FROM evento_proveedor
                WHERE id_proveedor = ?
                """;

        Integer cantidad = jdbcTemplate.queryForObject(sql, Integer.class, id);
        return cantidad != null && cantidad > 0;
    }

    // ELIMINAR PROVEEDOR
    public boolean eliminar(Integer id) {
        String sql = """
                DELETE FROM proveedor
                WHERE id_proveedor = ?
                """;

        return jdbcTemplate.update(sql, id) > 0;
    }
}
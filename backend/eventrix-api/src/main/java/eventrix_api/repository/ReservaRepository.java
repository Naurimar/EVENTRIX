package eventrix_api.repository;

import eventrix_api.model.Reserva;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.Statement;
import java.util.List;

@Repository
public class ReservaRepository {

    private final JdbcTemplate jdbcTemplate;

    public ReservaRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Reserva> reservaRowMapper = (rs, rowNum) -> {
        Reserva reserva = new Reserva();

        reserva.setIdReserva(rs.getInt("id_reserva"));
        reserva.setFechaInicio(
                rs.getTimestamp("fecha_inicio").toLocalDateTime());
        reserva.setFechaFin(
                rs.getTimestamp("fecha_fin").toLocalDateTime());
        reserva.setEstado(rs.getString("estado"));
        reserva.setCostoTotal(rs.getBigDecimal("costo_total"));
        reserva.setIdEvento(rs.getInt("id_evento"));
        reserva.setIdEspacio(rs.getInt("id_espacio"));

        return reserva;
    };

    // CONSULTAR TODAS LAS RESERVAS

    public List<Reserva> listarTodas() {

        String sql = """
                SELECT
                    id_reserva,
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    costo_total,
                    id_evento,
                    id_espacio
                FROM reserva
                ORDER BY fecha_inicio DESC
                """;

        return jdbcTemplate.query(sql, reservaRowMapper);
    }

    // CONSULTAR RESERVA POR ID

    public Reserva buscarPorId(Integer id) {

        String sql = """
                SELECT
                    id_reserva,
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    costo_total,
                    id_evento,
                    id_espacio
                FROM reserva
                WHERE id_reserva = ?
                """;

        List<Reserva> resultados =
                jdbcTemplate.query(sql, reservaRowMapper, id);

        return resultados.isEmpty() ? null : resultados.get(0);
    }

    // CONSULTAR RESERVAS DE UN EVENTO

    public List<Reserva> listarPorEvento(Integer idEvento) {

        String sql = """
                SELECT
                    id_reserva,
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    costo_total,
                    id_evento,
                    id_espacio
                FROM reserva
                WHERE id_evento = ?
                ORDER BY fecha_inicio DESC
                """;

        return jdbcTemplate.query(
                sql, reservaRowMapper, idEvento);
    }

    // CONSULTAR RESERVAS DE UN ESPACIO

    public List<Reserva> listarPorEspacio(Integer idEspacio) {

        String sql = """
                SELECT
                    id_reserva,
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    costo_total,
                    id_evento,
                    id_espacio
                FROM reserva
                WHERE id_espacio = ?
                ORDER BY fecha_inicio DESC
                """;

        return jdbcTemplate.query(
                sql, reservaRowMapper, idEspacio);
    }

    // REGISTRAR RESERVA

    public Reserva registrar(Reserva reserva) {

        String sql = """
                INSERT INTO reserva (
                    fecha_inicio,
                    fecha_fin,
                    estado,
                    costo_total,
                    id_evento,
                    id_espacio
                )
                VALUES (?, ?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {

            PreparedStatement statement = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS);

            statement.setTimestamp(
                    1, java.sql.Timestamp.valueOf(reserva.getFechaInicio()));

            statement.setTimestamp(
                    2, java.sql.Timestamp.valueOf(reserva.getFechaFin()));

            statement.setString(3, reserva.getEstado());

            statement.setBigDecimal(4, reserva.getCostoTotal());

            statement.setInt(5, reserva.getIdEvento());

            statement.setInt(6, reserva.getIdEspacio());

            return statement;

        }, keyHolder);

        Number idGenerado = keyHolder.getKey();

        if (idGenerado == null) {
            throw new IllegalStateException(
                    "No fue posible recuperar el identificador de la reserva.");
        }

        return buscarPorId(idGenerado.intValue());
    }

    // ACTUALIZAR RESERVA

    public Reserva actualizar(Integer id, Reserva reserva) {

        String sql = """
                UPDATE reserva
                SET
                    fecha_inicio = ?,
                    fecha_fin = ?,
                    estado = ?,
                    costo_total = ?,
                    id_evento = ?,
                    id_espacio = ?
                WHERE id_reserva = ?
                """;

        int filasActualizadas = jdbcTemplate.update(
                sql,
                java.sql.Timestamp.valueOf(reserva.getFechaInicio()),
                java.sql.Timestamp.valueOf(reserva.getFechaFin()),
                reserva.getEstado(),
                reserva.getCostoTotal(),
                reserva.getIdEvento(),
                reserva.getIdEspacio(),
                id);

        if (filasActualizadas == 0) {
            return null;
        }

        return buscarPorId(id);
    }

    // ELIMINAR RESERVA

    public boolean eliminar(Integer id) {

        String sql = """
                DELETE FROM reserva
                WHERE id_reserva = ?
                """;

        return jdbcTemplate.update(sql, id) > 0;
    }
}

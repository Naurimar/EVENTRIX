package eventrix_api.repository;

import eventrix_api.model.Invitado;

import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.jdbc.core.PreparedStatementCreator;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.Statement;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Repository
public class InvitadoRepository {

    private final JdbcTemplate jdbcTemplate;

    public InvitadoRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<Invitado> rowMapper = (rs, rowNum) -> {
        Invitado invitado = new Invitado();

        invitado.setIdInvitado(rs.getInt("id_invitado"));
        invitado.setNombre(rs.getString("nombre"));
        invitado.setCorreo(rs.getString("correo"));
        invitado.setTelefono(rs.getString("telefono"));
        invitado.setRestriccionDietetica(
                rs.getString("restriccion_dietetica"));
        invitado.setEstadoRsvp(rs.getString("estado_rsvp"));

        return invitado;
    };

    // LISTAR TODOS LOS INVITADOS
    public List<Invitado> listarTodos() {
        String sql = """
                SELECT id_invitado, nombre, correo, telefono,
                       restriccion_dietetica, estado_rsvp
                FROM invitado
                ORDER BY nombre ASC
                """;

        return jdbcTemplate.query(sql, rowMapper);
    }

    // BUSCAR INVITADO POR ID
    public Invitado buscarPorId(Integer id) {
        String sql = """
                SELECT id_invitado, nombre, correo, telefono,
                       restriccion_dietetica, estado_rsvp
                FROM invitado
                WHERE id_invitado = ?
                """;

        List<Invitado> resultados = jdbcTemplate.query(sql, rowMapper, id);

        return resultados.isEmpty() ? null : resultados.get(0);
    }

    // REGISTRAR INVITADO
    // REGISTRAR INVITADO Y OBTENER SU ID
    public Integer registrar(Invitado invitado) {

        String sql = """
                INSERT INTO invitado
                (nombre, correo, telefono, restriccion_dietetica, estado_rsvp)
                VALUES (?, ?, ?, ?, ?)
                """;

        KeyHolder keyHolder = new GeneratedKeyHolder();

        jdbcTemplate.update(connection -> {
            PreparedStatement ps = connection.prepareStatement(
                    sql,
                    Statement.RETURN_GENERATED_KEYS);

            ps.setString(1, invitado.getNombre());
            ps.setString(2, invitado.getCorreo());
            ps.setString(3, invitado.getTelefono());
            ps.setString(4, invitado.getRestriccionDietetica());
            ps.setString(5, invitado.getEstadoRsvp());

            return ps;
        }, keyHolder);

        return keyHolder.getKey() != null
                ? keyHolder.getKey().intValue()
                : null;
    }

    // ACTUALIZAR DATOS DEL INVITADO
    public boolean actualizar(Integer id, Invitado invitado) {
        String sql = """
                UPDATE invitado
                SET nombre = ?,
                    correo = ?,
                    telefono = ?,
                    restriccion_dietetica = ?,
                    estado_rsvp = ?
                WHERE id_invitado = ?
                """;

        return jdbcTemplate.update(
                sql,
                invitado.getNombre(),
                invitado.getCorreo(),
                invitado.getTelefono(),
                invitado.getRestriccionDietetica(),
                invitado.getEstadoRsvp(),
                id) > 0;
    }

    // ELIMINAR INVITADO
    public boolean eliminar(Integer id) {
        String sql = """
                DELETE FROM invitado
                WHERE id_invitado = ?
                """;

        return jdbcTemplate.update(sql, id) > 0;
    }

    // COMPROBAR SI EL INVITADO TIENE EVENTOS ASOCIADOS
    public boolean tieneEventosAsociados(Integer id) {
        String sql = """
                SELECT COUNT(*)
                FROM evento_invitado
                WHERE id_invitado = ?
                """;

        Integer cantidad = jdbcTemplate.queryForObject(
                sql, Integer.class, id);

        return cantidad != null && cantidad > 0;
    }

    // LISTAR EVENTOS
    public List<Map<String, Object>> listarEventos() {
        String sql = """
                SELECT id_evento, nombre, fecha, estado
                FROM evento
                ORDER BY fecha DESC
                """;

        return jdbcTemplate.queryForList(sql);
    }

    // LISTAR MESAS DE UN EVENTO
    public List<Map<String, Object>> listarMesasPorEvento(
            Integer idEvento) {

        String sql = """
                SELECT id_mesa, numero, capacidad, ubicacion, id_evento
                FROM mesa
                WHERE id_evento = ?
                ORDER BY numero ASC
                """;

        return jdbcTemplate.queryForList(sql, idEvento);
    }

    // COMPROBAR SI EXISTE UN EVENTO
    public boolean existeEvento(Integer idEvento) {
        String sql = """
                SELECT COUNT(*)
                FROM evento
                WHERE id_evento = ?
                """;

        Integer cantidad = jdbcTemplate.queryForObject(
                sql, Integer.class, idEvento);

        return cantidad != null && cantidad > 0;
    }

    // COMPROBAR SI YA EXISTE LA ASOCIACIÓN
    public boolean existeAsociacion(
            Integer idEvento,
            Integer idInvitado) {

        String sql = """
                SELECT COUNT(*)
                FROM evento_invitado
                WHERE id_evento = ?
                  AND id_invitado = ?
                """;

        Integer cantidad = jdbcTemplate.queryForObject(
                sql, Integer.class, idEvento, idInvitado);

        return cantidad != null && cantidad > 0;
    }

    // COMPROBAR SI UNA MESA PERTENECE A UN EVENTO
    public boolean mesaPerteneceEvento(
            Integer idMesa,
            Integer idEvento) {

        String sql = """
                SELECT COUNT(*)
                FROM mesa
                WHERE id_mesa = ?
                  AND id_evento = ?
                """;

        Integer cantidad = jdbcTemplate.queryForObject(
                sql, Integer.class, idMesa, idEvento);

        return cantidad != null && cantidad > 0;
    }

    // CONTAR INVITADOS ASIGNADOS A UNA MESA
    public int contarInvitadosEnMesa(Integer idMesa) {
        String sql = """
                SELECT COUNT(*)
                FROM evento_invitado
                WHERE id_mesa = ?
                """;

        Integer cantidad = jdbcTemplate.queryForObject(
                sql, Integer.class, idMesa);

        return cantidad != null ? cantidad : 0;
    }

    // OBTENER CAPACIDAD DE UNA MESA
    public Integer obtenerCapacidadMesa(Integer idMesa) {
        String sql = """
                SELECT capacidad
                FROM mesa
                WHERE id_mesa = ?
                """;

        return jdbcTemplate.queryForObject(
                sql, Integer.class, idMesa);
    }

    // ASOCIAR INVITADO A UN EVENTO
    @Transactional
    public void asociarInvitado(
            Integer idEvento,
            Integer idInvitado,
            Integer idMesa,
            String estadoRsvp) {

        Timestamp fechaConfirmacion = null;

        if ("Confirmado".equalsIgnoreCase(estadoRsvp)) {
            fechaConfirmacion = Timestamp.valueOf(LocalDateTime.now());
        }

        // Bloquear la mesa y comprobar su capacidad.
        if (idMesa != null) {
            String sqlCapacidad = """
                    SELECT capacidad
                    FROM mesa
                    WHERE id_mesa = ?
                      AND id_evento = ?
                    FOR UPDATE
                    """;

            Integer capacidad = jdbcTemplate.queryForObject(
                    sqlCapacidad,
                    Integer.class,
                    idMesa,
                    idEvento);

            int ocupados = contarInvitadosEnMesa(idMesa);

            if (ocupados >= capacidad) {
                throw new IllegalStateException(
                        "La mesa seleccionada ya alcanzó su capacidad.");
            }
        }

        String sql = """
                INSERT INTO evento_invitado
                (id_evento, id_invitado, id_mesa,
                 fecha_confirmacion, estado_rsvp)
                VALUES (?, ?, ?, ?, ?)
                """;

        jdbcTemplate.update(
                sql,
                idEvento,
                idInvitado,
                idMesa,
                fechaConfirmacion,
                estadoRsvp);
    }

    // LISTAR INVITADOS ASOCIADOS A UN EVENTO
    public List<Map<String, Object>> listarInvitadosPorEvento(
            Integer idEvento) {

        String sql = """
                SELECT
                    i.id_invitado,
                    i.nombre,
                    i.correo,
                    i.telefono,
                    i.restriccion_dietetica,
                    ei.estado_rsvp,
                    ei.fecha_confirmacion,
                    ei.id_mesa,
                    m.numero AS numero_mesa,
                    m.ubicacion AS ubicacion_mesa
                FROM evento_invitado ei
                INNER JOIN invitado i
                    ON ei.id_invitado = i.id_invitado
                LEFT JOIN mesa m
                    ON ei.id_mesa = m.id_mesa
                WHERE ei.id_evento = ?
                ORDER BY i.nombre ASC
                """;

        return jdbcTemplate.queryForList(sql, idEvento);
    }

    // ACTUALIZAR RSVP DE UN INVITADO EN UN EVENTO
    public boolean actualizarRsvp(
            Integer idEvento,
            Integer idInvitado,
            String estadoRsvp) {

        String sql = """
                UPDATE evento_invitado
                SET estado_rsvp = ?,
                    fecha_confirmacion = ?
                WHERE id_evento = ?
                  AND id_invitado = ?
                """;

        Timestamp fechaConfirmacion = null;

        if ("Confirmado".equalsIgnoreCase(estadoRsvp)) {
            fechaConfirmacion = Timestamp.valueOf(LocalDateTime.now());
        }

        return jdbcTemplate.update(
                sql,
                estadoRsvp,
                fechaConfirmacion,
                idEvento,
                idInvitado) > 0;
    }

    // ACTUALIZAR MESA DE UN INVITADO EN UN EVENTO
    @Transactional
    public boolean actualizarMesa(
            Integer idEvento,
            Integer idInvitado,
            Integer idMesa) {

        // Bloquear la asociación del invitado.
        String sqlBloquearAsociacion = """
                SELECT id_invitado
                FROM evento_invitado
                WHERE id_evento = ?
                  AND id_invitado = ?
                FOR UPDATE
                """;

        List<Integer> asociacion = jdbcTemplate.query(
                sqlBloquearAsociacion,
                (rs, rowNum) -> rs.getInt("id_invitado"),
                idEvento,
                idInvitado);

        if (asociacion.isEmpty()) {
            return false;
        }

        // Obtener la mesa que tiene actualmente.
        String sqlMesaActual = """
                SELECT id_mesa
                FROM evento_invitado
                WHERE id_evento = ?
                  AND id_invitado = ?
                """;

        Integer mesaActual = jdbcTemplate.query(
                sqlMesaActual,
                rs -> {
                    if (rs.next()) {
                        int mesa = rs.getInt("id_mesa");
                        return rs.wasNull() ? null : mesa;
                    }
                    return null;
                },
                idEvento,
                idInvitado);

        // Si se envía null, quitar la mesa asignada.
        if (idMesa == null) {
            String sqlQuitarMesa = """
                    UPDATE evento_invitado
                    SET id_mesa = NULL
                    WHERE id_evento = ?
                      AND id_invitado = ?
                    """;

            return jdbcTemplate.update(
                    sqlQuitarMesa,
                    idEvento,
                    idInvitado) > 0;
        }

        // Bloquear la mesa destino y comprobar que pertenece al evento.
        String sqlCapacidad = """
                SELECT capacidad
                FROM mesa
                WHERE id_mesa = ?
                  AND id_evento = ?
                FOR UPDATE
                """;

        Integer capacidad = jdbcTemplate.query(
                sqlCapacidad,
                rs -> rs.next() ? rs.getInt("capacidad") : null,
                idMesa,
                idEvento);

        if (capacidad == null) {
            throw new IllegalStateException(
                    "La mesa seleccionada no existe o no pertenece a este evento.");
        }

        // Si ya tiene esa mesa, no se modifica la ocupación.
        if (idMesa.equals(mesaActual)) {
            return true;
        }

        // Comprobar la capacidad disponible.
        int ocupados = contarInvitadosEnMesa(idMesa);

        if (ocupados >= capacidad) {
            throw new IllegalStateException(
                    "La mesa seleccionada ya alcanzó su capacidad.");
        }

        // Actualizar la mesa del invitado.
        String sqlActualizar = """
                UPDATE evento_invitado
                SET id_mesa = ?
                WHERE id_evento = ?
                  AND id_invitado = ?
                """;

        return jdbcTemplate.update(
                sqlActualizar,
                idMesa,
                idEvento,
                idInvitado) > 0;
    }

    // OBTENER MESA ACTUAL DE UN INVITADO EN UN EVENTO
    public Integer obtenerMesaDeInvitado(
            Integer idEvento,
            Integer idInvitado) {

        String sql = """
                SELECT id_mesa
                FROM evento_invitado
                WHERE id_evento = ?
                  AND id_invitado = ?
                """;

        return jdbcTemplate.query(
                sql,
                rs -> {
                    if (rs.next()) {
                        int mesa = rs.getInt("id_mesa");
                        return rs.wasNull() ? null : mesa;
                    }
                    return null;
                },
                idEvento,
                idInvitado);
    }

    // RETIRAR INVITADO DE UN EVENTO
    public boolean desasociarInvitado(
            Integer idEvento,
            Integer idInvitado) {

        String sql = """
                DELETE FROM evento_invitado
                WHERE id_evento = ?
                  AND id_invitado = ?
                """;

        return jdbcTemplate.update(
                sql,
                idEvento,
                idInvitado) > 0;
    }
}
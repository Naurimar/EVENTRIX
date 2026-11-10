package eventrix_api.repository;

import eventrix_api.model.ResumenReporte;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.Map;

@Repository
public class ReporteRepository {

    private static final String COLECCION = "resumen_reportes";
    private static final String ID_RESUMEN = "resumen_general";

    private final MongoTemplate mongoTemplate;

    public ReporteRepository(MongoTemplate mongoTemplate) {
        this.mongoTemplate = mongoTemplate;
    }

    public ResumenReporte obtenerResumen() {

        Document documento = mongoTemplate.findById(
            ID_RESUMEN,
            Document.class,
            COLECCION
        );

        if (documento == null) {
            return crearResumenVacio();
        }

        return new ResumenReporte(
            obtenerLong(documento, "totalEventos"),
            obtenerDecimal(documento, "presupuestoTotal"),
            obtenerDecimal(documento, "presupuestoPromedio"),
            obtenerLong(documento, "totalInvitados"),

            obtenerMapa(documento, "eventosPorEstado"),
            obtenerMapa(documento, "eventosPorTipo"),
            obtenerMapa(documento, "eventosPorMes"),

            obtenerMapa(documento, "reservas"),
            obtenerMapa(documento, "proveedores"),
            obtenerMapa(documento, "invitados"),

            documento.get("fechaGeneracion")
        );
    }

    private ResumenReporte crearResumenVacio() {
        return new ResumenReporte(
            0L,
            BigDecimal.ZERO,
            BigDecimal.ZERO,
            0L,
            new LinkedHashMap<>(),
            new LinkedHashMap<>(),
            new LinkedHashMap<>(),
            new LinkedHashMap<>(),
            new LinkedHashMap<>(),
            new LinkedHashMap<>(),
            null
        );
    }

    private Map<String, Object> obtenerMapa(
            Document documento,
            String campo) {

        Object valor = documento.get(campo);

        if (valor instanceof Map<?, ?> mapa) {
            Map<String, Object> resultado = new LinkedHashMap<>();

            mapa.forEach((clave, dato) ->
                resultado.put(String.valueOf(clave), dato)
            );

            return resultado;
        }

        return new LinkedHashMap<>();
    }

    private long obtenerLong(Document documento, String campo) {
        Object valor = documento.get(campo);

        if (valor == null) {
            return 0L;
        }

        if (valor instanceof Number numero) {
            return numero.longValue();
        }

        try {
            return Long.parseLong(valor.toString());
        } catch (NumberFormatException e) {
            throw new IllegalStateException(
                "El campo '" + campo
                    + "' no contiene un número entero válido.",
                e
            );
        }
    }

    private BigDecimal obtenerDecimal(Document documento, String campo) {
        Object valor = documento.get(campo);

        if (valor == null) {
            return BigDecimal.ZERO;
        }

        try {
            return new BigDecimal(valor.toString());
        } catch (NumberFormatException e) {
            throw new IllegalStateException(
                "El campo '" + campo
                    + "' no contiene un número decimal válido.",
                e
            );
        }
    }
}

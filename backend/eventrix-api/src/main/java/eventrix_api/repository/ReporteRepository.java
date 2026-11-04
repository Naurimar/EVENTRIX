
package eventrix_api.repository;

import eventrix_api.model.ResumenReporte;
import org.bson.Document;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;

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
            return new ResumenReporte(
                0L,
                BigDecimal.ZERO,
                BigDecimal.ZERO,
                0L
            );
        }

        long totalEventos = obtenerLong(documento, "totalEventos");
        BigDecimal presupuestoTotal =
            obtenerDecimal(documento, "presupuestoTotal");
        BigDecimal presupuestoPromedio =
            obtenerDecimal(documento, "presupuestoPromedio");
        long totalInvitados = obtenerLong(documento, "totalInvitados");

        return new ResumenReporte(
            totalEventos,
            presupuestoTotal,
            presupuestoPromedio,
            totalInvitados
        );
    }

    private long obtenerLong(Document documento, String campo) {
        Object valor = documento.get(campo);

        if (valor == null) {
            return 0L;
        }

        if (valor instanceof Number) {
            return ((Number) valor).longValue();
        }

        try {
            return Long.parseLong(valor.toString());
        } catch (NumberFormatException e) {
            throw new IllegalStateException(
                "El campo '" + campo
                    + "' del documento '" + ID_RESUMEN
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
                    + "' del documento '" + ID_RESUMEN
                    + "' no contiene un número decimal válido.",
                e
            );
        }
    }
}

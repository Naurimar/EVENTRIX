package eventrix_api.service;

import eventrix_api.model.ResumenReporte;

import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.pdmodel.PDPage;
import org.apache.pdfbox.pdmodel.PDPageContentStream;
import org.apache.pdfbox.pdmodel.common.PDRectangle;
import org.apache.pdfbox.pdmodel.font.PDType1Font;
import org.apache.pdfbox.pdmodel.font.Standard14Fonts;

import org.springframework.stereotype.Service;

import java.awt.Color;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.math.BigDecimal;
import java.text.NumberFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Locale;
import java.util.Map;

@Service
public class ReportePdfService {

    private static final Color AZUL =
            new Color(30, 55, 90);

    private static final Color AZUL_CLARO =
            new Color(65, 110, 165);

    private static final Color FONDO =
            new Color(242, 246, 251);

    private static final Color GRIS =
            new Color(100, 110, 125);

    private static final Color VERDE =
            new Color(35, 145, 105);

    private static final PDType1Font NORMAL =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA);

    private static final PDType1Font NEGRITA =
            new PDType1Font(Standard14Fonts.FontName.HELVETICA_BOLD);

    private static final float ANCHO = PDRectangle.A4.getWidth();
    private static final float ALTO = PDRectangle.A4.getHeight();

    private static final float MARGEN = 48;
    private static final float ANCHO_CONTENIDO = ANCHO - (MARGEN * 2);

    private final NumberFormat formatoNumero =
            NumberFormat.getNumberInstance(new Locale("es", "CO"));

    // ==========================================
    // GENERAR DOCUMENTO PDF
    // ==========================================

    public byte[] generarPdf(ResumenReporte resumen) throws IOException {

        try (
            PDDocument documento = new PDDocument();
            ByteArrayOutputStream salida = new ByteArrayOutputStream()
        ) {

            formatoNumero.setMaximumFractionDigits(0);

            Lienzo lienzo = new Lienzo(documento);

            dibujarPortada(lienzo, resumen);
            dibujarIndicadores(lienzo, resumen);

            dibujarDistribucion(
                    lienzo,
                    "ANÁLISIS DE EVENTOS",
                    "Eventos por estado",
                    resumen.getEventosPorEstado()
            );

            dibujarDistribucion(
                    lienzo,
                    "ANÁLISIS DE EVENTOS",
                    "Eventos por tipo",
                    resumen.getEventosPorTipo()
            );

            dibujarDistribucion(
                    lienzo,
                    "ANÁLISIS DE EVENTOS",
                    "Eventos por mes",
                    resumen.getEventosPorMes()
            );

            dibujarDistribucion(
                    lienzo,
                    "ANÁLISIS DE RESERVAS",
                    "Reservas por estado",
                    obtenerMapa(resumen.getReservas(), "reservasPorEstado")
            );

            dibujarDistribucion(
                    lienzo,
                    "ANÁLISIS DE PROVEEDORES",
                    "Proveedores por categoría",
                    obtenerMapa(resumen.getProveedores(), "proveedoresPorCategoria")
            );

            dibujarDistribucion(
                    lienzo,
                    "ANÁLISIS DE INVITADOS",
                    "Invitados registrados por estado",
                    obtenerMapa(resumen.getInvitados(), "invitadosPorEstado")
            );

            dibujarEstadisticasAdicionales(lienzo, resumen);

            lienzo.cerrar();

            documento.save(salida);

            return salida.toByteArray();
        }
    }

    // ==========================================
    // PORTADA
    // ==========================================

    private void dibujarPortada(
            Lienzo lienzo,
            ResumenReporte resumen) throws IOException {

        lienzo.rectangulo(
                0, ALTO - 230,
                ANCHO, 230,
                AZUL
        );

        lienzo.texto(
                "EVENTRIX",
                MARGEN,
                ALTO - 85,
                30,
                Color.WHITE,
                NEGRITA
        );

        lienzo.texto(
                "REPORTE GENERAL DE ANALITICA",
                MARGEN,
                ALTO - 125,
                17,
                Color.WHITE,
                NEGRITA
        );

        lienzo.texto(
                "Eventos, reservas, proveedores e invitados",
                MARGEN,
                ALTO - 155,
                11,
                Color.WHITE,
                NORMAL
        );

        lienzo.texto(
                "INFORME DEL SISTEMA",
                MARGEN,
                ALTO - 290,
                11,
                AZUL_CLARO,
                NEGRITA
        );

        lienzo.texto(
                "Resumen general de EVENTRIX",
                MARGEN,
                ALTO - 320,
                21,
                AZUL,
                NEGRITA
        );

        lienzo.texto(
                "Documento generado a partir de los indicadores almacenados",
                MARGEN,
                ALTO - 350,
                10,
                GRIS,
                NORMAL
        );

        lienzo.texto(
                "en el sistema de analítica de EVENTRIX.",
                MARGEN,
                ALTO - 365,
                10,
                GRIS,
                NORMAL
        );

        lienzo.rectangulo(
                MARGEN,
                ALTO - 445,
                ANCHO_CONTENIDO,
                65,
                FONDO
        );

        lienzo.texto(
                "FECHA DE GENERACION",
                MARGEN + 18,
                ALTO - 405,
                9,
                GRIS,
                NEGRITA
        );

        lienzo.texto(
                formatearFecha(resumen.getFechaGeneracion()),
                MARGEN + 18,
                ALTO - 427,
                11,
                AZUL,
                NEGRITA
        );

        lienzo.texto(
                "EVENTRIX - Reportes y analítica",
                MARGEN,
                65,
                9,
                GRIS,
                NORMAL
        );
    }

    // ==========================================
    // INDICADORES PRINCIPALES
    // ==========================================

    private void dibujarIndicadores(
            Lienzo lienzo,
            ResumenReporte resumen) throws IOException {

        lienzo.nuevaPagina();

        lienzo.seccion("INDICADORES PRINCIPALES");

        Map<String, Object> reservas = resumen.getReservas();
        Map<String, Object> proveedores = resumen.getProveedores();
        Map<String, Object> invitados = resumen.getInvitados();

        List<String[]> indicadores = new ArrayList<>();

        indicadores.add(new String[]{
                "Total de eventos",
                formatearNumero(resumen.getTotalEventos())
        });

        indicadores.add(new String[]{
                "Total de reservas",
                formatearNumero(obtenerNumero(reservas, "totalReservas"))
        });

        indicadores.add(new String[]{
                "Invitados estimados en eventos",
                formatearNumero(resumen.getTotalInvitados())
        });

        indicadores.add(new String[]{
                "Proveedores registrados",
                formatearNumero(obtenerNumero(proveedores, "totalProveedores"))
        });

        indicadores.add(new String[]{
                "Presupuesto total",
                formatearMoneda(resumen.getPresupuestoTotal())
        });

        indicadores.add(new String[]{
                "Presupuesto promedio",
                formatearMoneda(resumen.getPresupuestoPromedio())
        });

        indicadores.add(new String[]{
                "Proveedores activos",
                formatearNumero(obtenerNumero(proveedores, "proveedoresActivos"))
        });

        indicadores.add(new String[]{
                "Invitados registrados",
                formatearNumero(obtenerNumero(invitados, "totalInvitadosRegistrados"))
        });

        float anchoTarjeta = (ANCHO_CONTENIDO - 16) / 2;
        float altoTarjeta = 76;

        for (int i = 0; i < indicadores.size(); i++) {

            int columna = i % 2;
            int fila = i / 2;

            float x = MARGEN + columna * (anchoTarjeta + 16);
            float y = lienzo.getY() - (fila * (altoTarjeta + 14));

            lienzo.rectangulo(
                    x, y - altoTarjeta,
                    anchoTarjeta, altoTarjeta,
                    FONDO
            );

            lienzo.texto(
                    indicadores.get(i)[0],
                    x + 13,
                    y - 23,
                    9,
                    GRIS,
                    NORMAL
            );

            lienzo.texto(
                    ajustarTexto(indicadores.get(i)[1], 27),
                    x + 13,
                    y - 51,
                    15,
                    AZUL,
                    NEGRITA
            );
        }

        lienzo.setY(
                lienzo.getY() - 4 * (altoTarjeta + 14) - 10
        );

        lienzo.texto(
                "Los indicadores reflejan la información disponible",
                MARGEN,
                lienzo.getY(),
                9,
                GRIS,
                NORMAL
        );

        lienzo.bajar(25);

        lienzo.texto(
                "en el resumen almacenado en MongoDB.",
                MARGEN,
                lienzo.getY(),
                9,
                GRIS,
                NORMAL
        );
    }

    // ==========================================
    // DISTRIBUCIONES Y GRAFICAS
    // ==========================================

    private void dibujarDistribucion(
            Lienzo lienzo,
            String seccion,
            String titulo,
            Map<String, Object> datos) throws IOException {

        lienzo.espacio(190);

        lienzo.seccion(seccion);

        lienzo.texto(
                titulo,
                MARGEN,
                lienzo.getY(),
                14,
                AZUL,
                NEGRITA
        );

        lienzo.bajar(28);

        if (datos == null || datos.isEmpty()) {

            lienzo.rectangulo(
                    MARGEN,
                    lienzo.getY() - 55,
                    ANCHO_CONTENIDO,
                    55,
                    FONDO
            );

            lienzo.texto(
                    "Sin datos disponibles para esta distribucion.",
                    MARGEN + 14,
                    lienzo.getY() - 31,
                    10,
                    GRIS,
                    NORMAL
            );

            lienzo.bajar(75);
            return;
        }

        double maximo = datos.values().stream()
                .mapToDouble(this::convertirNumero)
                .max()
                .orElse(0);

        if (maximo <= 0) {
            maximo = 1;
        }

        int cantidad = 0;

        for (Map.Entry<String, Object> entrada : datos.entrySet()) {

            double valor = convertirNumero(entrada.getValue());

            if (valor <= 0) {
                continue;
            }

            lienzo.espacio(65);

            String nombre = entrada.getKey()
                    .replace("_", " ");

            lienzo.texto(
                    ajustarTexto(nombre, 38),
                    MARGEN,
                    lienzo.getY(),
                    9,
                    GRIS,
                    NORMAL
            );

            lienzo.texto(
                    formatearNumero(valor),
                    ANCHO - MARGEN - 35,
                    lienzo.getY(),
                    9,
                    AZUL,
                    NEGRITA
            );

            lienzo.bajar(12);

            float anchoBarra =
                    (float) (ANCHO_CONTENIDO * valor / maximo);

            lienzo.rectangulo(
                    MARGEN,
                    lienzo.getY() - 7,
                    Math.max(anchoBarra, 2),
                    9,
                    AZUL_CLARO
            );

            lienzo.bajar(22);

            cantidad++;
        }

        if (cantidad == 0) {
            lienzo.texto(
                    "Sin registros con valores mayores que cero.",
                    MARGEN,
                    lienzo.getY(),
                    9,
                    GRIS,
                    NORMAL
            );
            lienzo.bajar(20);
        }

        lienzo.bajar(10);
    }

    // ==========================================
    // ESTADISTICAS ADICIONALES
    // ==========================================

    private void dibujarEstadisticasAdicionales(
            Lienzo lienzo,
            ResumenReporte resumen) throws IOException {

        lienzo.nuevaPagina();

        lienzo.seccion("ESTADISTICAS COMPLEMENTARIAS");

        Map<String, Object> reservas = resumen.getReservas();
        Map<String, Object> proveedores = resumen.getProveedores();
        Map<String, Object> invitados = resumen.getInvitados();

        dibujarDato(
                lienzo,
                "Costo total de reservas",
                formatearMoneda(obtenerValor(reservas, "costoTotalReservas"))
        );

        dibujarDato(
                lienzo,
                "Costo promedio por reserva",
                formatearMoneda(obtenerValor(reservas, "costoPromedioReserva"))
        );

        dibujarDato(
                lienzo,
                "Proveedores inactivos",
                formatearNumero(obtenerNumero(proveedores, "proveedoresInactivos"))
        );

        dibujarDato(
                lienzo,
                "Calificación promedio de proveedores",
                formatearDecimal(obtenerValor(proveedores, "calificacionPromedio"))
        );

        dibujarDato(
                lienzo,
                "Invitados asociados a eventos",
                formatearNumero(obtenerNumero(invitados, "totalInvitadosAsociados"))
        );

        dibujarDato(
                lienzo,
                "Eventos con invitados asociados",
                formatearNumero(obtenerNumero(invitados, "eventosConInvitados"))
        );

        lienzo.bajar(25);

        lienzo.texto(
                "NOTA SOBRE LOS DATOS",
                MARGEN,
                lienzo.getY(),
                11,
                AZUL,
                NEGRITA
        );

        lienzo.bajar(20);

        lienzo.texto(
                "Los valores de este documento corresponden al resumen",
                MARGEN,
                lienzo.getY(),
                9,
                GRIS,
                NORMAL
        );

        lienzo.bajar(14);

        lienzo.texto(
                "disponible en el momento de su generación.",
                MARGEN,
                lienzo.getY(),
                9,
                GRIS,
                NORMAL
        );

        lienzo.bajar(14);

        lienzo.texto(
                "Los campos sin registros se presentan sin datos o con valor cero,",
                MARGEN,
                lienzo.getY(),
                9,
                GRIS,
                NORMAL
        );

        lienzo.bajar(14);

        lienzo.texto(
                "según la información almacenada en el sistema.",
                MARGEN,
                lienzo.getY(),
                9,
                GRIS,
                NORMAL
        );
    }

    private void dibujarDato(
            Lienzo lienzo,
            String titulo,
            String valor) throws IOException {

        lienzo.espacio(42);

        lienzo.texto(
                titulo,
                MARGEN,
                lienzo.getY(),
                9,
                GRIS,
                NORMAL
        );

        lienzo.texto(
                ajustarTexto(valor, 28),
                ANCHO - MARGEN - 145,
                lienzo.getY(),
                9,
                AZUL,
                NEGRITA
        );

        lienzo.bajar(22);

        lienzo.linea(
                MARGEN,
                lienzo.getY(),
                ANCHO - MARGEN,
                lienzo.getY(),
                new Color(220, 225, 232)
        );

        lienzo.bajar(15);
    }

    // ==========================================
    // FUNCIONES AUXILIARES
    // ==========================================

    private Map<String, Object> obtenerMapa(
            Map<String, Object> datos,
            String campo) {

        if (datos == null) {
            return Map.of();
        }

        Object valor = datos.get(campo);

        if (!(valor instanceof Map<?, ?> mapa)) {
            return Map.of();
        }

        java.util.LinkedHashMap<String, Object> resultado =
                new java.util.LinkedHashMap<>();

        mapa.forEach((clave, dato) ->
                resultado.put(String.valueOf(clave), dato)
        );

        return resultado;
    }

    private Object obtenerValor(
            Map<String, Object> datos,
            String campo) {

        if (datos == null) {
            return 0;
        }

        return datos.getOrDefault(campo, 0);
    }

    private long obtenerNumero(
            Map<String, Object> datos,
            String campo) {

        return (long) convertirNumero(obtenerValor(datos, campo));
    }

    private double convertirNumero(Object valor) {

        if (valor instanceof Number numero) {
            return numero.doubleValue();
        }

        if (valor == null) {
            return 0;
        }

        try {
            return Double.parseDouble(valor.toString());
        } catch (NumberFormatException error) {
            return 0;
        }
    }

    private String formatearNumero(Number valor) {
        return formatoNumero.format(valor);
    }

    private String formatearMoneda(Object valor) {

        try {
            BigDecimal numero = new BigDecimal(
                    valor == null ? "0" : valor.toString()
            );

            return "$ " + formatoNumero.format(numero) + " COP";

        } catch (NumberFormatException error) {
            return "$ 0 COP";
        }
    }

    private String formatearDecimal(Object valor) {

        try {
            double numero = Double.parseDouble(
                    valor == null ? "0" : valor.toString()
            );

            return String.format(Locale.US, "%.2f", numero);

        } catch (NumberFormatException error) {
            return "0.00";
        }
    }

    private String formatearFecha(Object fecha) {

        if (fecha == null) {
            return "Fecha no disponible";
        }

        return fecha.toString();
    }

    private String ajustarTexto(String texto, int maximo) {

        if (texto == null) {
            return "";
        }

        if (texto.length() <= maximo) {
            return texto;
        }

        return texto.substring(0, maximo - 3) + "...";
    }

    // ==========================================
    // CONTROL DEL DOCUMENTO Y PAGINAS
    // ==========================================

    private class Lienzo {

        private final PDDocument documento;

        private PDPage pagina;
        private PDPageContentStream contenido;
        private float y;

        Lienzo(PDDocument documento) throws IOException {
            this.documento = documento;
            nuevaPagina();
        }

        void nuevaPagina() throws IOException {

            if (contenido != null) {
                contenido.close();
            }

            pagina = new PDPage(PDRectangle.A4);
            documento.addPage(pagina);

            contenido = new PDPageContentStream(documento, pagina);

            y = ALTO - 55;

            rectangulo(
                    0,
                    ALTO - 36,
                    ANCHO,
                    36,
                    AZUL
            );

            texto(
                    "EVENTRIX | REPORTES Y ANALITICA",
                    MARGEN,
                    ALTO - 23,
                    9,
                    Color.WHITE,
                    NEGRITA
            );

            linea(
                    MARGEN,
                    38,
                    ANCHO - MARGEN,
                    38,
                    new Color(220, 225, 232)
            );

            texto(
                    "Documento generado por EVENTRIX",
                    MARGEN,
                    25,
                    8,
                    GRIS,
                    NORMAL
            );
        }

        void seccion(String titulo) throws IOException {

            espacio(55);

            texto(
                    titulo,
                    MARGEN,
                    y,
                    16,
                    AZUL,
                    NEGRITA
            );

            bajar(25);

            linea(
                    MARGEN,
                    y,
                    ANCHO - MARGEN,
                    y,
                    AZUL_CLARO
            );

            bajar(25);
        }

        void texto(
                String valor,
                float x,
                float posicionY,
                float tamano,
                Color color,
                PDType1Font fuente) throws IOException {

            contenido.beginText();
            contenido.setFont(fuente, tamano);
            contenido.setNonStrokingColor(color);
            contenido.newLineAtOffset(x, posicionY);
            contenido.showText(limpiarTexto(valor));
            contenido.endText();
        }

        void rectangulo(
                float x,
                float posicionY,
                float ancho,
                float alto,
                Color color) throws IOException {

            contenido.setNonStrokingColor(color);
            contenido.addRect(x, posicionY, ancho, alto);
            contenido.fill();
        }

        void linea(
                float x1,
                float y1,
                float x2,
                float y2,
                Color color) throws IOException {

            contenido.setStrokingColor(color);
            contenido.setLineWidth(0.7f);
            contenido.moveTo(x1, y1);
            contenido.lineTo(x2, y2);
            contenido.stroke();
        }

        void bajar(float cantidad) {
            y -= cantidad;
        }

        float getY() {
            return y;
        }

        void setY(float nuevaY) {
            y = nuevaY;
        }

        void espacio(float requerido) throws IOException {

            if (y - requerido < 65) {
                nuevaPagina();
            }
        }

        void cerrar() throws IOException {

            if (contenido != null) {
                contenido.close();
                contenido = null;
            }
        }

        private String limpiarTexto(String texto) {

            if (texto == null) {
                return "";
            }

            return texto
                    .replace("—", "-")
                    .replace("–", "-")
                    .replace("’", "'")
                    .replace("•", "-");
        }
    }
}


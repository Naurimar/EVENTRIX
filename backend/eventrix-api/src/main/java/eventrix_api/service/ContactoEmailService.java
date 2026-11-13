
package eventrix_api.service;

import eventrix_api.dto.ContactoRequest;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;

@Service
public class ContactoEmailService {

    private static final String URL_BREVO =
            "https://api.brevo.com/v3/smtp/email";

    private static final String CORREO_EVENTRIX =
            "eventrixsoporte@gmail.com";

    private static final HttpClient CLIENTE = HttpClient.newBuilder()
            .connectTimeout(Duration.ofSeconds(10))
            .build();

    public void enviar(ContactoRequest contacto) {

        String apiKey = obtenerApiKey();

        String asunto = contacto.asunto()
                .replace("\r", " ")
                .replace("\n", " ")
                .trim();

        String mensajeAdmin =
                "Nuevo mensaje recibido desde el formulario de EVENTRIX.\n\n"
                + "Nombre: " + contacto.nombre() + "\n"
                + "Correo: " + contacto.correo() + "\n"
                + "Asunto: " + asunto + "\n\n"
                + "Mensaje:\n" + contacto.mensaje();

        enviarCorreo(
                apiKey,
                CORREO_EVENTRIX,
                "Equipo EVENTRIX",
                "Nuevo mensaje desde EVENTRIX: " + asunto,
                mensajeAdmin
        );

        String mensajeConfirmacion =
                "Hola " + contacto.nombre() + ".\n\n"
                + "Hemos recibido tu mensaje correctamente.\n"
                + "Nuestro equipo de EVENTRIX lo revisara "
                + "y se pondra en contacto contigo si es necesario.\n\n"
                + "Gracias por comunicarte con nosotros.\n\n"
                + "Equipo EVENTRIX";

        enviarCorreo(
                apiKey,
                contacto.correo(),
                contacto.nombre(),
                "Hemos recibido tu mensaje - EVENTRIX",
                mensajeConfirmacion
        );
    }

    // Metodo reutilizable para solicitudes de proveedores
    public void enviarCorreoTexto(
            String destinatario,
            String nombreDestinatario,
            String asunto,
            String contenido) {

        String apiKey = obtenerApiKey();

        enviarCorreo(
                apiKey,
                destinatario,
                nombreDestinatario,
                asunto,
                contenido
        );
    }

    private String obtenerApiKey() {

        String apiKey = System.getenv("BREVO_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException(
                    "El servicio de correo no esta configurado."
            );
        }

        return apiKey;
    }

    private void enviarCorreo(
            String apiKey,
            String destinatario,
            String nombreDestinatario,
            String asunto,
            String contenido) {

        String json = """
                {
                  "sender": {
                    "name": "Eventrix",
                    "email": "%s"
                  },
                  "to": [
                    {
                      "email": "%s",
                      "name": "%s"
                    }
                  ],
                  "subject": "%s",
                  "textContent": "%s"
                }
                """.formatted(
                escaparJson(CORREO_EVENTRIX),
                escaparJson(destinatario),
                escaparJson(nombreDestinatario),
                escaparJson(asunto),
                escaparJson(contenido)
        );

        HttpRequest solicitud = HttpRequest.newBuilder()
                .uri(URI.create(URL_BREVO))
                .timeout(Duration.ofSeconds(20))
                .header("accept", "application/json")
                .header("api-key", apiKey)
                .header("content-type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(
                        json, StandardCharsets.UTF_8))
                .build();

        try {
            HttpResponse<String> respuesta = CLIENTE.send(
                    solicitud,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (respuesta.statusCode() < 200
                    || respuesta.statusCode() >= 300) {
                throw new IllegalStateException(
                        "Brevo no pudo enviar el correo. Codigo HTTP: "
                                + respuesta.statusCode()
                );
            }

        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            throw new IllegalStateException(
                    "Se interrumpio el envio del correo."
            );
        } catch (IOException e) {
            throw new IllegalStateException(
                    "No fue posible conectar con el servicio de correo."
            );
        }
    }

    private String escaparJson(String texto) {

        StringBuilder resultado = new StringBuilder();

        for (char caracter : texto.toCharArray()) {
            switch (caracter) {
                case '"' -> resultado.append("\\\"");
                case '\\' -> resultado.append("\\\\");
                case '\n' -> resultado.append("\\n");
                case '\r' -> resultado.append("\\r");
                case '\t' -> resultado.append("\\t");
                default -> {
                    if (caracter < 0x20) {
                        resultado.append(String.format(
                                "\\u%04x", (int) caracter));
                    } else {
                        resultado.append(caracter);
                    }
                }
            }
        }

        return resultado.toString();
    }
}

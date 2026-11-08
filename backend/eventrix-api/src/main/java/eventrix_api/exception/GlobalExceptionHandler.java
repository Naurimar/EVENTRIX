package eventrix_api.exception;

import jakarta.validation.ConstraintViolationException;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, Object>> manejarNoEncontrado(
            NoSuchElementException excepcion) {

        return construirRespuesta(
                HttpStatus.NOT_FOUND,
                excepcion.getMessage()
        );
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> manejarArgumentoInvalido(
            IllegalArgumentException excepcion) {

        return construirRespuesta(
                HttpStatus.BAD_REQUEST,
                excepcion.getMessage()
        );
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> manejarValidaciones(
            MethodArgumentNotValidException excepcion) {

        Map<String, String> errores = new LinkedHashMap<>();

        for (FieldError error : excepcion.getBindingResult().getFieldErrors()) {
            errores.putIfAbsent(
                    error.getField(),
                    error.getDefaultMessage()
            );
        }

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("estado", HttpStatus.BAD_REQUEST.value());
        respuesta.put("error", "Error de validación");
        respuesta.put("detalles", errores);

        return ResponseEntity.badRequest().body(respuesta);
    }

    @ExceptionHandler(ConstraintViolationException.class)
    public ResponseEntity<Map<String, Object>> manejarRestricciones(
            ConstraintViolationException excepcion) {

        return construirRespuesta(
                HttpStatus.BAD_REQUEST,
                excepcion.getMessage()
        );
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> manejarSolicitudIncorrecta(
            HttpMessageNotReadableException excepcion) {

        return construirRespuesta(
                HttpStatus.BAD_REQUEST,
                "El cuerpo de la solicitud está vacío o tiene un formato incorrecto"
        );
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> manejarErrorGeneral(
            Exception excepcion) {

        return construirRespuesta(
                HttpStatus.INTERNAL_SERVER_ERROR,
                "Ocurrió un error interno en el servidor"
        );
    }

    private ResponseEntity<Map<String, Object>> construirRespuesta(
            HttpStatus estado,
            String mensaje) {

        Map<String, Object> respuesta = new LinkedHashMap<>();
        respuesta.put("estado", estado.value());
        respuesta.put("error", estado.getReasonPhrase());
        respuesta.put("mensaje", mensaje);

        return ResponseEntity.status(estado).body(respuesta);
    }
}
package eventrix_api.controller;

import eventrix_api.dto.ContactoRequest;
import eventrix_api.service.ContactoEmailService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/contacto")
public class ContactoController {

    private final ContactoEmailService contactoEmailService;

    public ContactoController(ContactoEmailService contactoEmailService) {
        this.contactoEmailService = contactoEmailService;
    }

    @PostMapping
    public ResponseEntity<Map<String, String>> enviarContacto(
            @Valid @RequestBody ContactoRequest contacto) {

        contactoEmailService.enviar(contacto);

        return ResponseEntity.ok(Map.of(
                "mensaje",
                "Tu mensaje fue enviado correctamente. Hemos enviado una confirmación a tu correo."
        ));
    }
}
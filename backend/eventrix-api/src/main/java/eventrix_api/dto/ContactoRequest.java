package eventrix_api.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record ContactoRequest(

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede superar 100 caracteres")
    String nombre,

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo electrónico no es válido")
    @Size(max = 150, message = "El correo es demasiado largo")
    String correo,

    @NotBlank(message = "El asunto es obligatorio")
    @Size(max = 100, message = "El asunto no puede superar 100 caracteres")
    String asunto,

    @NotBlank(message = "El mensaje es obligatorio")
    @Size(max = 3000, message = "El mensaje no puede superar 3000 caracteres")
    String mensaje

) {}

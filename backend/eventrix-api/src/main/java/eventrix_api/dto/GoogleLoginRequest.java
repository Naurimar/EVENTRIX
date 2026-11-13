package eventrix_api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class GoogleLoginRequest {

    @NotBlank(message = "La credencial de Google es obligatoria")
    private String credential;

    @Pattern(
            regexp = "(?i)CLIENTE|PROVEEDOR",
            message = "El tipo de cuenta debe ser CLIENTE o PROVEEDOR"
    )
    private String tipoCuenta;

    public GoogleLoginRequest() {
    }

    public String getCredential() {
        return credential;
    }

    public void setCredential(String credential) {
        this.credential = credential;
    }

    public String getTipoCuenta() {
        return tipoCuenta;
    }

    public void setTipoCuenta(String tipoCuenta) {
        this.tipoCuenta = tipoCuenta;
    }
}

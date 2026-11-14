
package eventrix_api.service;

import eventrix_api.dto.LoginRequest;
import eventrix_api.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService) {
        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
    }

    public String iniciarSesion(LoginRequest solicitud) {

        Authentication autenticacion =
                authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(
                        solicitud.getCorreo(),
                        solicitud.getClave()
                    )
                );

        return jwtService.generarToken(
                (org.springframework.security.core.userdetails.UserDetails)
                        autenticacion.getPrincipal()
        );
    }
}

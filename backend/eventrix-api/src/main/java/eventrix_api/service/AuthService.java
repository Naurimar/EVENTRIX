
package eventrix_api.service;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;

import eventrix_api.dto.LoginRequest;
import eventrix_api.dto.RegistroRequest;
import eventrix_api.model.Rol;
import eventrix_api.model.Usuario;
import eventrix_api.repository.RolRepository;
import eventrix_api.repository.UsuarioRepository;
import eventrix_api.security.JwtService;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.Collections;
import java.util.Locale;
import java.util.UUID;

@Service
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JwtService jwtService;
    private final UsuarioRepository usuarioRepository;
    private final RolRepository rolRepository;
    private final PasswordEncoder passwordEncoder;
    private final String googleClientId;

    public AuthService(
            AuthenticationManager authenticationManager,
            JwtService jwtService,
            UsuarioRepository usuarioRepository,
            RolRepository rolRepository,
            PasswordEncoder passwordEncoder,
            @Value("${google.client-id}") String googleClientId) {

        this.authenticationManager = authenticationManager;
        this.jwtService = jwtService;
        this.usuarioRepository = usuarioRepository;
        this.rolRepository = rolRepository;
        this.passwordEncoder = passwordEncoder;
        this.googleClientId = googleClientId;
    }

    public String iniciarSesion(LoginRequest solicitud) {

        Authentication autenticacion =
                authenticationManager.authenticate(
                    UsernamePasswordAuthenticationToken.unauthenticated(
                        solicitud.getCorreo().trim().toLowerCase(Locale.ROOT),
                        solicitud.getClave()
                    )
                );

        return jwtService.generarToken(
                (UserDetails) autenticacion.getPrincipal()
        );
    }

    @Transactional
    public String registrarUsuario(RegistroRequest solicitud) {

        String correo = solicitud.getCorreo()
                .trim()
                .toLowerCase(Locale.ROOT);

        if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
            throw new IllegalArgumentException(
                    "Este correo electrónico ya está registrado"
            );
        }

        if ("PROVEEDOR".equalsIgnoreCase(solicitud.getTipoCuenta().trim())) {
            throw new IllegalArgumentException(
                    "Para registrarte como proveedor debes completar una solicitud y obtener la aprobación de EVENTRIX."
            );
        }

        Rol rol = obtenerRolPermitido(solicitud.getTipoCuenta());

        Usuario usuario = new Usuario();
        usuario.setNombre(solicitud.getNombre().trim());
        usuario.setCorreo(correo);
        usuario.setClave(passwordEncoder.encode(solicitud.getClave()));
        usuario.setEstado(true);
        usuario.setRol(rol);

        usuario = usuarioRepository.save(usuario);

        return generarTokenUsuario(usuario);
    }

    @Transactional
    public String iniciarSesionConGoogle(
            String credential,
            String tipoCuenta) {

        GoogleIdToken idToken;

        try {
            GoogleIdTokenVerifier verifier =
                    new GoogleIdTokenVerifier.Builder(
                            new NetHttpTransport(),
                            GsonFactory.getDefaultInstance()
                    )
                    .setAudience(Collections.singletonList(googleClientId))
                    .build();

            idToken = verifier.verify(credential);

        } catch (GeneralSecurityException | IOException | IllegalArgumentException e) {
            throw new BadCredentialsException(
                    "No fue posible verificar la identidad de Google"
            );
        }

        if (idToken == null) {
            throw new BadCredentialsException(
                    "La credencial de Google no es válida"
            );
        }

        GoogleIdToken.Payload payload = idToken.getPayload();

        String issuer = payload.getIssuer();
        String googleSub = payload.getSubject();
        String correo = payload.getEmail();

        if (!"accounts.google.com".equals(issuer)
                && !"https://accounts.google.com".equals(issuer)) {
            throw new BadCredentialsException(
                    "El emisor de la credencial no es válido"
            );
        }

        if (!Boolean.TRUE.equals(payload.getEmailVerified())
                || correo == null || correo.isBlank()
                || googleSub == null || googleSub.isBlank()) {
            throw new BadCredentialsException(
                    "Google no ha verificado el correo de esta cuenta"
            );
        }

        correo = correo.trim().toLowerCase(Locale.ROOT);

        Usuario usuario = usuarioRepository.findByGoogleSub(googleSub)
                .orElse(null);

        if (usuario != null) {

            if (!usuario.getCorreo().equalsIgnoreCase(correo)) {
                throw new BadCredentialsException(
                        "La identidad de Google no coincide con la cuenta registrada"
                );
            }

            if (!Boolean.TRUE.equals(usuario.getEstado())) {
                throw new BadCredentialsException(
                        "La cuenta de EVENTRIX está inactiva"
                );
            }

        } else {

            if (usuarioRepository.existsByCorreoIgnoreCase(correo)) {
                throw new BadCredentialsException(
                        "Este correo ya tiene una cuenta. Inicia sesión con tu contraseña para vincularla."
                );
            }

            if (tipoCuenta == null || tipoCuenta.isBlank()) {
                throw new BadCredentialsException(
                        "Debes seleccionar CLIENTE o PROVEEDOR antes de crear tu cuenta con Google"
                );
            }

            if ("PROVEEDOR".equalsIgnoreCase(tipoCuenta.trim())) {
                throw new BadCredentialsException(
                        "Para registrarte como proveedor debes completar una solicitud y obtener la aprobación de EVENTRIX."
                );
            }

            Rol rol = obtenerRolPermitido(tipoCuenta);

            Object nombreGoogle = payload.get("name");

            String nombre = nombreGoogle instanceof String
                    && !((String) nombreGoogle).isBlank()
                    ? ((String) nombreGoogle).trim()
                    : correo.substring(0, correo.indexOf('@'));

            if (nombre.length() > 100) {
                nombre = nombre.substring(0, 100);
            }

            usuario = new Usuario();
            usuario.setNombre(nombre);
            usuario.setCorreo(correo);
            usuario.setGoogleSub(googleSub);
            usuario.setClave(
                    passwordEncoder.encode(UUID.randomUUID().toString())
            );
            usuario.setEstado(true);
            usuario.setRol(rol);

            usuario = usuarioRepository.save(usuario);
        }

        return generarTokenUsuario(usuario);
    }

    private Rol obtenerRolPermitido(String tipoCuenta) {

        if (tipoCuenta == null) {
            throw new IllegalArgumentException(
                    "Debes seleccionar un tipo de cuenta"
            );
        }

        String tipo = tipoCuenta.trim().toUpperCase(Locale.ROOT);

        if (!"CLIENTE".equals(tipo)) {
            throw new IllegalArgumentException(
                    "El registro directo solo permite cuentas CLIENTE. Los proveedores requieren aprobación."
            );
        }

        return rolRepository.findByNombreIgnoreCase(tipo)
                .orElseThrow(() -> new IllegalStateException(
                        "No se encontró el rol " + tipo + " en la base de datos"
                ));
    }

    private String generarTokenUsuario(Usuario usuario) {

        UserDetails usuarioDetails = User.withUsername(usuario.getCorreo())
                .password(usuario.getClave())
                .authorities("ROLE_" + usuario.getRol().getNombre())
                .build();

        return jwtService.generarToken(usuarioDetails);
    }
}

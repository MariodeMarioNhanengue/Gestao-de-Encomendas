package mz.encomendas.service;

import mz.encomendas.dto.LoginRequest;
import mz.encomendas.dto.TokenResponse;
import mz.encomendas.model.Administrador;
import mz.encomendas.repository.AdministradorRepository;
import mz.encomendas.security.JwtService;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import mz.encomendas.exception.ApiException;

@Service
public class AuthService {

    private final AdministradorRepository repo;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(AdministradorRepository repo, PasswordEncoder encoder, JwtService jwt) {
        this.repo = repo;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    public TokenResponse login(LoginRequest req) {
        Administrador a = repo.findByEmailIgnoreCase(req.email().trim())
                .filter(Administrador::isAtivo)
                .filter(x -> encoder.matches(req.password(), x.getSenhaHash()))
                .orElseThrow(() -> new ApiException(HttpStatus.UNAUTHORIZED, "Email ou palavra-passe incorretos"));
        return new TokenResponse(jwt.generate(a.getEmail()), a.getNome());
    }
}

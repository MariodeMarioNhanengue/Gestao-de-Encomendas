package mz.encomendas.service;

import mz.encomendas.model.Administrador;
import mz.encomendas.repository.AdministradorRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

/** Cria o primeiro administrador a partir de ADMIN_EMAIL / ADMIN_PASSWORD, se ainda não existir nenhum. */
@Component
public class AdminSeeder implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(AdminSeeder.class);
    private final AdministradorRepository repo;
    private final PasswordEncoder encoder;
    private final String email;
    private final String password;

    public AdminSeeder(AdministradorRepository repo, PasswordEncoder encoder,
                       @Value("${app.admin.email}") String email,
                       @Value("${app.admin.password}") String password) {
        this.repo = repo;
        this.encoder = encoder;
        this.email = email;
        this.password = password;
    }

    @Override
    public void run(ApplicationArguments args) {
        if (repo.count() > 0) return;
        if (email.isBlank() || password.length() < 8) {
            log.warn("Nenhum administrador criado: defina ADMIN_EMAIL e ADMIN_PASSWORD (mínimo 8 caracteres)");
            return;
        }
        Administrador a = new Administrador();
        a.setNome("Administrador");
        a.setEmail(email.trim().toLowerCase());
        a.setSenhaHash(encoder.encode(password));
        repo.save(a);
        log.info("Administrador inicial criado: {}", a.getEmail());
    }
}

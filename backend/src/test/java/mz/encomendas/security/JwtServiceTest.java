package mz.encomendas.security;

import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class JwtServiceTest {

    private static final String SECRET = "test-secret-with-at-least-32-characters-long";

    @Test
    void tokenRoundTrip() {
        JwtService jwt = new JwtService(SECRET, 5);
        assertEquals("admin@x.com", jwt.validate(jwt.generate("admin@x.com")).orElseThrow());
    }

    @Test
    void invalidTokenIsRejected() {
        JwtService jwt = new JwtService(SECRET, 5);
        assertTrue(jwt.validate("lixo.lixo.lixo").isEmpty());
        assertTrue(new JwtService(SECRET + "x", 5).validate(jwt.generate("a@b.c")).isEmpty());
    }

    @Test
    void shortSecretIsRefused() {
        assertThrows(IllegalStateException.class, () -> new JwtService("curto", 5));
    }
}

package mz.encomendas.controller;

import mz.encomendas.config.SecurityConfig;
import mz.encomendas.security.JwtAuthFilter;
import mz.encomendas.security.JwtService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.TestPropertySource;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(PingController.class)
@Import({SecurityConfig.class, JwtAuthFilter.class, JwtService.class})
@TestPropertySource(properties = {
        "app.cors.allowed-origins=http://localhost:5173",
        "app.jwt-secret=test-secret-with-at-least-32-characters-long",
        "app.jwt-expiration-minutes=5"})
class PingControllerTest {

    @Autowired
    MockMvc mvc;

    @Test
    void pingIsPublic() throws Exception {
        mvc.perform(get("/api/ping")).andExpect(status().isOk()).andExpect(jsonPath("$.status").value("ok"));
    }

    @Test
    void adminRequiresAuth() throws Exception {
        mvc.perform(get("/api/admin/products")).andExpect(status().isUnauthorized());
    }
}

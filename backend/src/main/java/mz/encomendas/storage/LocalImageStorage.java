package mz.encomendas.storage;

import mz.encomendas.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Map;
import java.util.UUID;

/** Só para desenvolvimento local: guarda em ./uploads. Em produção usar Cloudinary/S3 (disco efémero). */
@Component
@ConditionalOnProperty(name = "app.storage", havingValue = "local", matchIfMissing = true)
public class LocalImageStorage implements ImageStorage, WebMvcConfigurer {

    private static final Logger log = LoggerFactory.getLogger(LocalImageStorage.class);
    private static final Map<String, String> EXT = Map.of("image/jpeg", ".jpg", "image/png", ".png", "image/webp", ".webp");
    private final Path dir = Path.of("uploads").toAbsolutePath();
    private final String publicUrl;

    public LocalImageStorage(@Value("${app.public-url:http://localhost:8080}") String publicUrl) {
        this.publicUrl = publicUrl.replaceAll("/+$", "");
    }

    @Override
    public StoredImage store(MultipartFile file) {
        try {
            Files.createDirectories(dir);
            String name = UUID.randomUUID() + EXT.getOrDefault(file.getContentType(), ".img");
            file.transferTo(dir.resolve(name));
            return new StoredImage(publicUrl + "/uploads/" + name, name);
        } catch (IOException e) {
            log.error("Falha a guardar ficheiro local", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, "Não foi possível guardar a foto.");
        }
    }

    @Override
    public void delete(String publicId) {
        if (publicId == null || publicId.contains("/") || publicId.contains("..")) return;
        try {
            Files.deleteIfExists(dir.resolve(publicId));
        } catch (IOException e) {
            log.warn("Não foi possível apagar {}", publicId, e);
        }
    }

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        registry.addResourceHandler("/uploads/**").addResourceLocations(dir.toUri().toString());
    }
}

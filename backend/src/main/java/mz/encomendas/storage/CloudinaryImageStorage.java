package mz.encomendas.storage;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import mz.encomendas.exception.ApiException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Component
@ConditionalOnProperty(name = "app.storage", havingValue = "cloudinary")
public class CloudinaryImageStorage implements ImageStorage {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryImageStorage.class);
    private final Cloudinary cloudinary;

    public CloudinaryImageStorage(@Value("${cloudinary.url}") String url) {
        if (url == null || url.isBlank()) {
            throw new IllegalStateException("CLOUDINARY_URL não definido (STORAGE=cloudinary)");
        }
        this.cloudinary = new Cloudinary(url);
    }

    @Override
    public StoredImage store(MultipartFile file) {
        try {
            Map<?, ?> r = cloudinary.uploader().upload(file.getBytes(),
                    ObjectUtils.asMap("folder", "encomendas/produtos", "resource_type", "image"));
            return new StoredImage((String) r.get("secure_url"), (String) r.get("public_id"));
        } catch (IOException e) {
            log.error("Falha no upload para o Cloudinary", e);
            throw new ApiException(HttpStatus.BAD_GATEWAY, "Não foi possível guardar a foto. Tente novamente.");
        }
    }

    @Override
    public void delete(String publicId) {
        if (publicId == null) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            log.warn("Não foi possível apagar a imagem {} no Cloudinary", publicId, e);
        }
    }
}

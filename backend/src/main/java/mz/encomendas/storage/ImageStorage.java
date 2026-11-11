package mz.encomendas.storage;

import org.springframework.web.multipart.MultipartFile;

/** Armazenamento das fotos dos produtos (RN18). */
public interface ImageStorage {
    StoredImage store(MultipartFile file);
    void delete(String publicId);
}

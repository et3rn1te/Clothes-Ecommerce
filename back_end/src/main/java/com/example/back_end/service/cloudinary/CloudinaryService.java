package com.example.back_end.service.cloudinary;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@Slf4j
public class CloudinaryService implements ICloudinaryService {

    private final Cloudinary cloudinary;

    @Override
    public Map<String, String> uploadFile(MultipartFile file, String folder) {
        try {
            Map<String, Object> options = ObjectUtils.asMap(
                    "folder", folder,
                    "resource_type", "auto"
            );
            Map<String, String> uploadResult = cloudinary.uploader().upload(file.getBytes(), options);
            return Map.of(
                    "publicId", uploadResult.get("public_id"),
                    "url", uploadResult.get("secure_url")
            );
        } catch (IOException e) {
            log.error("Error uploading file to Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }

    @Override
    public boolean deleteFile(String publicId) {
        try {
            Map<String, String> result = cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
            return "ok".equals(result.get("result"));
        } catch (IOException e) {
            log.error("Error deleting file from Cloudinary: {}", e.getMessage());
            throw new RuntimeException("Failed to delete image from Cloudinary", e);
        }
    }
}
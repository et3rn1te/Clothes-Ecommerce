package com.example.back_end.service.cloudinary;

import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

public interface ICloudinaryService {
    Map<String, String> uploadFile(MultipartFile file, String folder);
    boolean deleteFile(String publicId);
}
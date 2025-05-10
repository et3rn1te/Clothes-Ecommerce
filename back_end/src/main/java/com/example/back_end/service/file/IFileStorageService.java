package com.example.back_end.service.file;

import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

public interface IFileStorageService {
    String storeFile(MultipartFile file, String subDirectory);
    Resource loadFileAsResource(String filePath);
    void deleteFile(String filePath);
    boolean fileExists(String filePath);
}
package com.example.back_end.service.file;

import com.example.back_end.exception.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Objects;
import java.util.UUID;

@Service
public class FileStorageService implements IFileStorageService {

    private final Path fileStorageLocation;

    public FileStorageService(@Value("${file.upload-dir:/uploads}") String uploadDir) {
        this.fileStorageLocation = Paths.get(uploadDir).toAbsolutePath().normalize();

        try {
            Files.createDirectories(this.fileStorageLocation);
        } catch (IOException ex) {
            throw new AppException(ErrorCode.FILE_STORAGE_ERROR);
        }
    }

    @Override
    public String storeFile(MultipartFile file, String subDirectory) {
        // Create subdirectory if not exists
        Path subDir = this.fileStorageLocation.resolve(subDirectory);
        try {
            Files.createDirectories(subDir);
        } catch (IOException ex) {
            throw new AppException(ErrorCode.FILE_STORAGE_ERROR);
        }

        // Normalize file name
        String originalFileName = StringUtils.cleanPath(Objects.requireNonNull(file.getOriginalFilename()));
        String fileExtension = "";

        try {
            if (originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }

            // Generate unique file name
            String fileName = UUID.randomUUID().toString() + fileExtension;

            // Copy file to the target location
            Path targetLocation = subDir.resolve(fileName);
            Files.copy(file.getInputStream(), targetLocation, StandardCopyOption.REPLACE_EXISTING);

            return subDirectory + "/" + fileName;
        } catch (IOException ex) {
            throw new AppException(ErrorCode.FILE_STORAGE_ERROR);
        }
    }

    @Override
    public Resource loadFileAsResource(String filePath) {
        try {
            Path resolvedPath = this.fileStorageLocation.resolve(filePath).normalize();
            Resource resource = new UrlResource(resolvedPath.toUri());

            if (resource.exists()) {
                return resource;
            } else {
                throw new AppException(ErrorCode.FILE_NOT_FOUND);
            }
        } catch (MalformedURLException ex) {
            throw new AppException(ErrorCode.FILE_NOT_FOUND);
        }
    }

    @Override
    public void deleteFile(String filePath) {
        try {
            Path resolvedPath = this.fileStorageLocation.resolve(filePath).normalize();
            Files.deleteIfExists(resolvedPath);
        } catch (IOException ex) {
            throw new AppException(ErrorCode.FILE_DELETE_ERROR);
        }
    }

    @Override
    public boolean fileExists(String filePath) {
        Path resolvedPath = this.fileStorageLocation.resolve(filePath).normalize();
        return Files.exists(resolvedPath);
    }
}

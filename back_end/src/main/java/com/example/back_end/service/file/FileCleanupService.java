package com.example.back_end.service.file;

import com.example.back_end.entity.Image;
import com.example.back_end.repository.ImageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FileCleanupService {

    private final ImageRepository imageRepository;
    private final IFileStorageService fileStorageService;

    /**
     * Runs every day at midnight to clean up orphaned files
     */
    @Scheduled(cron = "0 0 0 * * ?")
    public void cleanupOrphanedFiles() {
        // Get all file paths from database
        List<Image> allImages = imageRepository.findAll();
        Set<String> databaseFilePaths = new HashSet<>();
        allImages.forEach(image -> databaseFilePaths.add(image.getFilePath()));

        // Get root uploads directory 
        Path uploadsDir = Paths.get(System.getProperty("file.upload-dir", "/uploads")).toAbsolutePath().normalize();

        try {
            // Walk through all files in uploads directory
            Files.walkFileTree(uploadsDir, new SimpleFileVisitor<Path>() {
                @Override
                public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) {
                    // Get relative path from uploads directory
                    String relativePath = uploadsDir.relativize(file).toString().replace('\\', '/');

                    // If file exists on disk but not in database, delete it
                    if (!databaseFilePaths.contains(relativePath)) {
                        try {
                            Files.delete(file);
                            System.out.println("Deleted orphaned file: " + relativePath);
                        } catch (IOException e) {
                            System.err.println("Failed to delete orphaned file: " + relativePath);
                        }
                    }

                    return FileVisitResult.CONTINUE;
                }

                @Override
                public FileVisitResult visitFileFailed(Path file, IOException exc) {
                    // Skip files that can't be visited
                    return FileVisitResult.CONTINUE;
                }
            });
        } catch (IOException e) {
            System.err.println("Error during file cleanup: " + e.getMessage());
        }
    }

    /**
     * Validates all database image entries to ensure files exist
     */
    @Scheduled(cron = "0 0 1 * * ?") // Run at 1:00 AM every day
    public void validateDatabaseEntries() {
        List<Image> allImages = imageRepository.findAll();

        for (Image image : allImages) {
            String filePath = image.getFilePath();

            if (!fileStorageService.fileExists(filePath)) {
                System.out.println("Found database entry with missing file: Image ID " + image.getId() + ", Path: " + filePath);
                // Optionally, you could mark these entries or log them for review
                // You might not want to automatically delete them as it could be a temporary issue
            }
        }
    }
}
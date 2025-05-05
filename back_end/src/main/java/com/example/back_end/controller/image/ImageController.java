package com.example.back_end.controller.image;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.image.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.sql.SQLException;
import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/images")
public class ImageController {
    private final IImageService imageService;

    @PostMapping("/product/upload")
    public ResponseEntity<ApiResponse<List<ImageDto>>> uploadProductImages(
            @RequestParam List<MultipartFile> files,
            @RequestParam Long productId) {
        List<ImageDto> imageDtos = imageService.saveProductImages(files, productId);
        return ResponseEntity.ok(
                ApiResponse.<List<ImageDto>>builder()
                        .code(0)
                        .message("Images uploaded successfully")
                        .data(imageDtos)
                        .build()
        );
    }

    @PostMapping("/user/avatar/upload")
    public ResponseEntity<ApiResponse<List<ImageDto>>> uploadAvatar(
            @RequestParam MultipartFile file,
            @RequestParam Long userId) {
        ImageDto imageDto = imageService.saveUserAvatar(file, userId);
        return ResponseEntity.ok(
                ApiResponse.<List<ImageDto>>builder()
                        .code(0)
                        .message("Images uploaded successfully")
                        .data(imageDto)
                        .build()
        );
    }

    @GetMapping("/image/download/{imageId}")
    public ResponseEntity<Resource> downloadImage(@PathVariable Long imageId) throws SQLException {
        var image = imageService.getImageById(imageId);
        ByteArrayResource resource = new ByteArrayResource(
                image.getImage().getBytes(1, (int) image.getImage().length())
        );
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(image.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + image.getFileName() + "\"")
                .body(resource);
    }

    @PutMapping("/image/{imageId}/update")
    public ResponseEntity<ApiResponse<Void>> updateImage(
            @PathVariable Long imageId,
            @RequestParam MultipartFile file) {
        imageService.updateImage(file, imageId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .code(0)
                        .message("Image updated successfully")
                        .build()
        );
    }

    @DeleteMapping("/image/{imageId}/delete")
    public ResponseEntity<ApiResponse<Void>> deleteImage(
            @PathVariable Long imageId) {
        imageService.deleteImage(imageId);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .code(0)
                        .message("Image deleted successfully")
                        .build()
        );
    }


}


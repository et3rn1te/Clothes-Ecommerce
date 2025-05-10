package com.example.back_end.controller.image;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.image.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
    public ResponseEntity<ApiResponse<ImageDto>> uploadAvatar(
            @RequestParam MultipartFile file,
            @RequestParam Long userId) {
        ImageDto imageDto = imageService.saveUserAvatar(file, userId);
        return ResponseEntity.ok(
                ApiResponse.<ImageDto>builder()
                        .code(0)
                        .message("Avatar uploaded successfully")
                        .data(imageDto)
                        .build()
        );
    }

    @GetMapping("/image/download/{imageId}")
    public ResponseEntity<Resource> downloadImage(@PathVariable Long imageId) {
        ImageDto imageDto = imageService.getImageById(imageId);
        Resource resource = imageService.getImageResource(imageId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(imageDto.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + imageDto.getOriginalFileName() + "\"")
                .body(resource);
    }

    @GetMapping("/view/{imageId}")
    public ResponseEntity<Resource> viewImage(@PathVariable Long imageId) {
        ImageDto imageDto = imageService.getImageById(imageId);
        Resource resource = imageService.getImageResource(imageId);

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(imageDto.getFileType()))
                .body(resource);
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ImageDto>>> getProductImages(@PathVariable Long productId) {
        List<ImageDto> imageDtos = imageService.getProductImages(productId);
        return ResponseEntity.ok(
                ApiResponse.<List<ImageDto>>builder()
                        .code(0)
                        .message("Product images retrieved successfully")
                        .data(imageDtos)
                        .build()
        );
    }

    @GetMapping("/user/avatar/{userId}")
    public ResponseEntity<ApiResponse<ImageDto>> getUserAvatar(@PathVariable Long userId) {
        ImageDto imageDto = imageService.getUserAvatar(userId);
        return ResponseEntity.ok(
                ApiResponse.<ImageDto>builder()
                        .code(0)
                        .message("User avatar retrieved successfully")
                        .data(imageDto)
                        .build()
        );
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

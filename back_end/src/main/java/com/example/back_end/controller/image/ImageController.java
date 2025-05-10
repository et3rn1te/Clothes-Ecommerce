package com.example.back_end.controller.image;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.entity.Image;
import com.example.back_end.service.image.IImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.view.RedirectView;

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

    @GetMapping("/view/redirect/{imageId}")
    public RedirectView viewImageRedirect(@PathVariable Long imageId) {
        Image image = imageService.getImageById(imageId);
        return new RedirectView(image.getUrl());
    }

    @GetMapping("/image/{imageId}")
    public ResponseEntity<ApiResponse<ImageDto>> getImageById(@PathVariable Long imageId) {
        Image image = imageService.getImageById(imageId);
        return ResponseEntity.ok(
                ApiResponse.<ImageDto>builder()
                        .code(0)
                        .message("Image retrieved successfully")
                        .data(image)
                        .build()
        );
    }

    @GetMapping("/product/{productId}")
    public ResponseEntity<ApiResponse<List<ImageDto>>> getProductImages(
            @PathVariable Long productId) {
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
    public ResponseEntity<ApiResponse<ImageDto>> getUserAvatar(
            @PathVariable Long userId) {
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
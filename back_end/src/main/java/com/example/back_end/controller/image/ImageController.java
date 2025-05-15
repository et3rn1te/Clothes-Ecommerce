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

@RequiredArgsConstructor
@RestController
@RequestMapping("/images")
public class ImageController {

    private final IImageService imageService;

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
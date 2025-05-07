package com.example.back_end.service.image;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.entity.Image;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    List<ImageDto> saveProductImages(List<MultipartFile> files, Long productId);
    ImageDto saveUserAvatar(MultipartFile files, Long userId);

    Image getImageById(Long id);

    void updateImage(MultipartFile file, Long id);

    void deleteImage(Long id);
}

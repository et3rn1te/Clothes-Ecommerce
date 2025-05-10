package com.example.back_end.service.image;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.entity.Image;
import org.springframework.core.io.Resource;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface IImageService {
    List<ImageDto> saveProductImages(List<MultipartFile> files, Long productId);

    ImageDto saveUserAvatar(MultipartFile file, Long userId);

    Resource getImageResource(Long imageId);

    Image getImageEntityById(Long imageId);

    ImageDto getImageById(Long imageId);

    void updateImage(MultipartFile file, Long imageId);

    void deleteImage(Long imageId);

    List<ImageDto> getProductImages(Long productId);

    ImageDto getUserAvatar(Long userId);
}
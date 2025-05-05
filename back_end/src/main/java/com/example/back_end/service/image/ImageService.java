package com.example.back_end.service.image;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.entity.Image;
import com.example.back_end.entity.User;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.repository.ImageRepository;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.user.UserService;
import com.example.back_end.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import javax.sql.rowset.serial.SerialBlob;
import java.io.IOException;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {
    private final ImageRepository imageRepository;
    private final IProductService productService;
    private final UserRepository userRepository;
    private final UserService userService;

    private static final String URL_PREFIX = "/api/images/";

    @Override
    public List<ImageDto> saveProductImages(List<MultipartFile> files, Long productId) {
        var product = productService.getProductById(productId);
        return files.stream()
                .map(file -> {
                    Image img = new Image();
                    img.setProduct(product);
                    return saveAndMap(img, file);
                })
                .toList();
    }

    @Override
    public ImageDto saveUserAvatar(MultipartFile file, Long userId) {
        var user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));
        Image avatar = new Image();
        avatar.setUser(user);
        ImageDto dto = saveAndMap(avatar, file);

        // gán avatar cho user
        user.setAvatar(imageRepository.findById(dto.getId()).orElseThrow());
        userRepository.save(user);

        return dto;
    }

    /**
     * Tạo chung: 1) set blob, 2) save, 3) build URL, 4) save lại, 5) map → DTO
     */
    private ImageDto saveAndMap(Image img, MultipartFile file) {
        try {
            img.setFileName(file.getOriginalFilename());
            img.setFileType(file.getContentType());
            img.setImage(new SerialBlob(file.getBytes()));

            // 1) Save lần 1 để có ID
            Image saved = imageRepository.save(img);

            // 2) Build URL và save lại
            saved.setDownloadUrl(URL_PREFIX + saved.getId() + "/download");
            imageRepository.save(saved);

            // 3) Map sang DTO bằng setter
            ImageDto dto = new ImageDto();
            dto.setId(saved.getId());
            dto.setImageName(saved.getFileName());
            dto.setDownloadUrl(saved.getDownloadUrl());
            return dto;

        } catch (IOException | SQLException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }



    @Override
    public Image getImageById(Long id) {
        return imageRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
    }

    @Override
    public void deleteImage(Long id) {
        Image image = getImageById(id);
        imageRepository.delete(image);
    }

    @Override
    public void updateImage(MultipartFile file, Long id) {
        Image image = getImageById(id);
        try {
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setImage(new SerialBlob(file.getBytes()));
            imageRepository.save(image);
        } catch (IOException | SQLException e) {
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }
}
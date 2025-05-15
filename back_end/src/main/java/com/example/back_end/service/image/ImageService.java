package com.example.back_end.service.image;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.example.back_end.dto.ImageDto;
import com.example.back_end.entity.*;
import com.example.back_end.exception.*;
import com.example.back_end.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class ImageService implements IImageService {

    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final Cloudinary cloudinary;

    @Override
    @Transactional
    public List<ImageDto> saveProductImages(List<MultipartFile> files, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<Image> images = new ArrayList<>();

        for (MultipartFile file : files) {
            try {
                // Upload to Cloudinary
                Map uploadResult = cloudinary.uploader().upload(
                        file.getBytes(),
                        ObjectUtils.asMap(
                                "folder", "products",
                                "resource_type", "auto"
                        )
                );

                // Create and save image entity
                Image image = Image.builder()
                        .fileName(file.getOriginalFilename())
                        .fileType(file.getContentType())
                        .publicId((String) uploadResult.get("public_id"))
                        .url((String) uploadResult.get("secure_url"))
                        .product(product)
                        .build();

                images.add(imageRepository.save(image));

            } catch (IOException e) {
                log.error("Error uploading image to Cloudinary", e);
                throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
            }
        }

        return images.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ImageDto saveUserAvatar(MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        // Check if user already has an avatar
        Optional<Image> existingAvatar = imageRepository.findByUserId(userId);
        if (existingAvatar.isPresent()) {
            // Delete existing avatar from Cloudinary
            try {
                cloudinary.uploader().destroy(
                        existingAvatar.get().getPublicId(),
                        ObjectUtils.emptyMap()
                );
            } catch (IOException e) {
                log.error("Error deleting existing avatar from Cloudinary", e);
                // Continue executing even if there's an error with Cloudinary deletion
            }
            // Delete existing avatar from database
            imageRepository.delete(existingAvatar.get());
        }

        try {
            // Upload to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", "avatars",
                            "resource_type", "auto"
                    )
            );

            // Create and save image entity
            Image image = Image.builder()
                    .fileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .publicId((String) uploadResult.get("public_id"))
                    .url((String) uploadResult.get("secure_url"))
                    .user(user)
                    .build();

            Image savedImage = imageRepository.save(image);
            return convertToDto(savedImage);

        } catch (IOException e) {
            log.error("Error uploading avatar to Cloudinary", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Image getImageById(Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
    }

    @Override
    @Transactional
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        try {
            // Delete existing image from Cloudinary
            cloudinary.uploader().destroy(
                    image.getPublicId(),
                    ObjectUtils.emptyMap()
            );

            // Upload new image to Cloudinary
            Map uploadResult = cloudinary.uploader().upload(
                    file.getBytes(),
                    ObjectUtils.asMap(
                            "folder", image.getUser() != null ? "avatars" : "products",
                            "resource_type", "auto"
                    )
            );

            // Update image entity
            image.setFileName(file.getOriginalFilename());
            image.setFileType(file.getContentType());
            image.setPublicId((String) uploadResult.get("public_id"));
            image.setUrl((String) uploadResult.get("secure_url"));

            imageRepository.save(image);

        } catch (IOException e) {
            log.error("Error updating image in Cloudinary", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Override
    @Transactional
    public void deleteImage(Long imageId) {
        Image image = imageRepository.findById(imageId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));

        try {
            // Delete from Cloudinary
            cloudinary.uploader().destroy(
                    image.getPublicId(),
                    ObjectUtils.emptyMap()
            );

            // Delete from database
            imageRepository.delete(image);

        } catch (IOException e) {
            log.error("Error deleting image from Cloudinary", e);
            throw new AppException(ErrorCode.UNCATEGORIZED_EXCEPTION);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<ImageDto> getProductImages(Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        List<Image> images = imageRepository.findByProductId(productId);
        return images.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional(readOnly = true)
    public ImageDto getUserAvatar(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new AppException(ErrorCode.USER_NOT_EXISTED));

        Image image = imageRepository.findByUserId(userId)
                .orElseThrow(() -> new AppException(ErrorCode.IMAGE_NOT_FOUND));
        return convertToDto(image);
    }

    private ImageDto convertToDto(Image image) {
        return ImageDto.builder()
                .id(image.getId())
                .fileName(image.getFileName())
                .fileType(image.getFileType())
                .publicId(image.getPublicId())
                .url(image.getUrl())
                .createdAt(image.getCreatedAt())
                .updatedAt(image.getUpdatedAt())
                .productId(image.getProduct() != null ? image.getProduct().getId() : null)
                .userId(image.getUser() != null ? image.getUser().getId() : null)
                .build();
    }
}
package com.example.back_end.service.image;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.entity.Image;
import com.example.back_end.entity.Product;
import com.example.back_end.entity.User;
import com.example.back_end.exception.ResourceNotFoundException;
import com.example.back_end.repository.ImageRepository;
import com.example.back_end.repository.ProductRepository;
import com.example.back_end.repository.UserRepository;
import com.example.back_end.service.file.IFileStorageService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ImageService implements IImageService {

    private final ImageRepository imageRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final IFileStorageService fileStorageService;

    @Value("${app.base-url:http://localhost:8080}")
    private String baseUrl;

    @Override
    @Transactional
    public List<ImageDto> saveProductImages(List<MultipartFile> files, Long productId) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new ResourceNotFoundException("Product not found with id: " + productId));

        List<Image> savedImages = new ArrayList<>();

        for (MultipartFile file : files) {
            String filePath = fileStorageService.storeFile(file, "products/" + productId);

            Image image = Image.builder()
                    .fileName(filePath.substring(filePath.lastIndexOf('/') + 1))
                    .originalFileName(file.getOriginalFilename())
                    .fileType(file.getContentType())
                    .filePath(filePath)
                    .fileSize(file.getSize())
                    .imageType("PRODUCT")
                    .product(product)
                    .build();

            savedImages.add(imageRepository.save(image));
        }

        return savedImages.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ImageDto saveUserAvatar(MultipartFile file, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + userId));

        // Check if user already has an avatar
        Optional<Image> existingAvatar = imageRepository.findByUserId(userId);
        if (existingAvatar.isPresent()) {
            // Delete existing avatar file
            fileStorageService.deleteFile(existingAvatar.get().getFilePath());
            imageRepository.delete(existingAvatar.get());
        }

        // Save new avatar
        String filePath = fileStorageService.storeFile(file, "users/avatars");

        Image image = Image.builder()
                .fileName(filePath.substring(filePath.lastIndexOf('/') + 1))
                .originalFileName(file.getOriginalFilename())
                .fileType(file.getContentType())
                .filePath(filePath)
                .fileSize(file.getSize())
                .imageType("USER_AVATAR")
                .user(user)
                .build();

        Image savedImage = imageRepository.save(image);
        return convertToDto(savedImage);
    }

    @Override
    public Resource getImageResource(Long imageId) {
        Image image = getImageEntityById(imageId);
        return fileStorageService.loadFileAsResource(image.getFilePath());
    }

    @Override
    public Image getImageEntityById(Long imageId) {
        return imageRepository.findById(imageId)
                .orElseThrow(() -> new ResourceNotFoundException("Image not found with id: " + imageId));
    }

    @Override
    public ImageDto getImageById(Long imageId) {
        Image image = getImageEntityById(imageId);
        return convertToDto(image);
    }

    @Override
    @Transactional
    public void updateImage(MultipartFile file, Long imageId) {
        Image image = getImageEntityById(imageId);

        // Delete old file
        fileStorageService.deleteFile(image.getFilePath());

        // Store new file
        String subDirectory = image.getImageType().equals("PRODUCT") ?
                "products/" + image.getProduct().getId() : "users/avatars";
        String filePath = fileStorageService.storeFile(file, subDirectory);

        // Update image entity
        image.setFileName(filePath.substring(filePath.lastIndexOf('/') + 1));
        image.setOriginalFileName(file.getOriginalFilename());
        image.setFileType(file.getContentType());
        image.setFilePath(filePath);
        image.setFileSize(file.getSize());

        imageRepository.save(image);
    }

    @Override
    @Transactional
    public void deleteImage(Long imageId) {
        Image image = getImageEntityById(imageId);

        // Delete file from storage
        fileStorageService.deleteFile(image.getFilePath());

        // Delete image entity
        imageRepository.delete(image);
    }

    @Override
    public List<ImageDto> getProductImages(Long productId) {
        List<Image> images = imageRepository.findAllProductImages(productId);
        return images.stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Override
    public ImageDto getUserAvatar(Long userId) {
        Image avatar = imageRepository.findUserAvatar(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Avatar not found for user with id: " + userId));
        return convertToDto(avatar);
    }

    private ImageDto convertToDto(Image image) {
        String imageUrl = ServletUriComponentsBuilder.fromHttpUrl(baseUrl)
                .path("/images/image/download/")
                .path(String.valueOf(image.getId()))
                .toUriString();

        return ImageDto.builder()
                .id(image.getId())
                .originalFileName(image.getOriginalFileName())
                .fileType(image.getFileType())
                .imageType(image.getImageType())
                .imageUrl(imageUrl)
                .productId(image.getProduct() != null ? image.getProduct().getId() : null)
                .userId(image.getUser() != null ? image.getUser().getId() : null)
                .build();
    }
}
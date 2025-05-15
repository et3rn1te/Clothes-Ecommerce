package com.example.back_end.dto;

import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ImageDto {
    private Long id;
    private String fileName;
    private String fileType;
    private String publicId;
    private String url;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private Long productId;
    private Long userId;
}
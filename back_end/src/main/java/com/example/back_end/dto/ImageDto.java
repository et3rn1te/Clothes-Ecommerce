package com.example.back_end.dto;

import lombok.Data;

@Data
public class ImageDto {
    private Long id;
    private String imageName;
    private String downloadUrl;
}
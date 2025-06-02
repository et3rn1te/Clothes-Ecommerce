package com.example.back_end.dto.response.category;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategorySummary {
    private Long id;
    private String name;
    private String description;
    private String parentName;
    private CategoryImageResponse categoryImage;
    private String slug;
    private Long parentId;
    private boolean active;
}
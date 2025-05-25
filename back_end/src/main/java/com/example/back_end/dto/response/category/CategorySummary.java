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
    private Long parentId;
    private String parentName;
    private String imageUrl;
    private String slug;
}
package com.example.back_end.dto.response.category;

import lombok.*;

import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryListResponse {
    private List<CategoryResponse> categories;
    private int totalPages;
    private long totalElements;
    private int currentPage;
}

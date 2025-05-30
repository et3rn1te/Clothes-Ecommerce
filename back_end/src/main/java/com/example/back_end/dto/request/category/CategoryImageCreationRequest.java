package com.example.back_end.dto.request.category;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.web.multipart.MultipartFile;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CategoryImageCreationRequest {
    @NotNull(message = "Image file is required")
    private MultipartFile imageFile;

    @Size(max = 100, message = "Alt text cannot exceed 100 characters")
    private String altText;
}

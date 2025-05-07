package com.example.back_end.dto.request;

import com.example.back_end.entity.*;
import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class AddProductRequest {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private int quantity; // quantity of the product
    private String description;
    private Category category;
    private List<Image> images;
}

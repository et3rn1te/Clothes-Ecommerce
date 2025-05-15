package com.example.back_end.controller.product;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.dto.ProductDto;
import com.example.back_end.dto.request.AddProductRequest;
import com.example.back_end.dto.request.UpdateProductRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.service.image.IImageService;
import com.example.back_end.service.product.IProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RequiredArgsConstructor
@RestController
@RequestMapping("/products")
public class ProductController {
    private final IProductService productService;
    private final IImageService imageService;

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getAllProducts() {
        List<ProductDto> products = productService.getConvertedProducts(productService.getAllProducts());
        return ResponseEntity.ok(
                ApiResponse.<List<ProductDto>>builder()
                        .code(0)
                        .message("Product list retrieved successfully")
                        .data(products)
                        .build()
        );
    }

    @PostMapping("/add")
    public ResponseEntity<ApiResponse<ProductDto>> addProduct(@RequestBody AddProductRequest request) {
        ProductDto created = productService.convertToDto(productService.addProduct(request));
        return ResponseEntity.ok(
                ApiResponse.<ProductDto>builder()
                        .code(0)
                        .message("Product added successfully")
                        .data(created)
                        .build()
        );
    }

    @GetMapping("/product/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        ProductDto dto = productService.convertToDto(productService.getProductById(id));
        return ResponseEntity.ok(
                ApiResponse.<ProductDto>builder()
                        .code(0)
                        .message("Product retrieved successfully")
                        .data(dto)
                        .build()
        );
    }

    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<ProductDto>>> searchProducts(
            @RequestParam(required = false) String name,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) String brand) {
        List<ProductDto> list;
        if (name != null && category != null && brand != null) {
            list = productService.getConvertedProducts(
                    productService.getProductsByCategoryAndBrand(category, brand)
                            .stream().filter(p -> p.getName().contains(name)).toList());
        } else if (name != null && category != null) {
            list = productService.getConvertedProducts(
                    productService.getProductsByCategoryAndName(category, name));
        } else if (name != null && brand != null) {
            list = productService.getConvertedProducts(
                    productService.getProductsByBrandAndName(brand, name));
        } else if (category != null && brand != null) {
            list = productService.getConvertedProducts(
                    productService.getProductsByCategoryAndBrand(category, brand));
        } else if (name != null) {
            list = productService.getConvertedProducts(
                    productService.getProductsByName(name));
        } else if (category != null) {
            list = productService.getConvertedProducts(
                    productService.getProductsByCategory(category));
        } else if (brand != null) {
            list = productService.getConvertedProducts(
                    productService.getProductsByBrand(brand));
        } else {
            list = productService.getConvertedProducts(productService.getAllProducts());
        }
        return ResponseEntity.ok(
                ApiResponse.<List<ProductDto>>builder()
                        .code(0)
                        .message("Search completed")
                        .data(list)
                        .build()
        );
    }

    @PutMapping("/product/{id}")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @RequestBody UpdateProductRequest request) {
        ProductDto updated = productService.convertToDto(productService.updateProduct(request, id));
        return ResponseEntity.ok(
                ApiResponse.<ProductDto>builder()
                        .code(0)
                        .message("Product updated successfully")
                        .data(updated)
                        .build()
        );
    }

    @DeleteMapping("/product/{id}")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProductById(id);
        return ResponseEntity.ok(
                ApiResponse.<Void>builder()
                        .code(0)
                        .message("Product deleted successfully")
                        .build()
        );
    }

    @GetMapping("/count")
    public ResponseEntity<ApiResponse<Long>> countByBrandAndName(
            @RequestParam String brand,
            @RequestParam String name) {
        Long count = productService.countProductsByBrandAndName(brand, name);
        return ResponseEntity.ok(
                ApiResponse.<Long>builder()
                        .code(0)
                        .message("Count retrieved successfully")
                        .data(count)
                        .build()
        );
    }

    @PostMapping("/product/image/upload")
    public ResponseEntity<ApiResponse<List<ImageDto>>> uploadProductImages(
            @RequestParam List<MultipartFile> files,
            @RequestParam Long productId) {
        List<ImageDto> imageDtos = imageService.saveProductImages(files, productId);
        return ResponseEntity.ok(
                ApiResponse.<List<ImageDto>>builder()
                        .code(0)
                        .message("Images uploaded successfully")
                        .data(imageDtos)
                        .build()
        );
    }
    @GetMapping("/product/image/{productId}")
    public ResponseEntity<ApiResponse<List<ImageDto>>> getProductImages(
            @PathVariable Long productId) {
        List<ImageDto> imageDtos = imageService.getProductImages(productId);
        return ResponseEntity.ok(
                ApiResponse.<List<ImageDto>>builder()
                        .code(0)
                        .message("Product images retrieved successfully")
                        .data(imageDtos)
                        .build()
        );
    }
}

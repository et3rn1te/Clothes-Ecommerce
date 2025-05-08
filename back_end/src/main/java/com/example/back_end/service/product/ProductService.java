package com.example.back_end.service.product;

import com.example.back_end.dto.ImageDto;
import com.example.back_end.dto.ProductDto;
import com.example.back_end.dto.request.AddProductRequest;
import com.example.back_end.dto.request.UpdateProductRequest;
import com.example.back_end.entity.Category;
import com.example.back_end.entity.Image;
import com.example.back_end.entity.Product;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.exception.ProductNotFoundException;
import com.example.back_end.repository.CategoryRepository;
import com.example.back_end.repository.ImageRepository;
import com.example.back_end.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class ProductService implements IProductService {
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;
    private final ImageRepository imageRepository;
    private final ModelMapper modelMapper;

    @Override
    public Product addProduct(AddProductRequest request) {
        // Check if the category is found in the DB
        // If Yes, set it  as the new ProductCategory
        // If No, save it as a new ProductCategory
        Category category = Optional.ofNullable(categoryRepository.findByName(request.getCategory().getName())).orElseGet(() -> {
            Category newCategory = new Category(request.getCategory().getName());
            return categoryRepository.save(newCategory);
        });
        request.setCategory(category);
        return productRepository.save(createProduct(request, category));
    }

    private Product createProduct(AddProductRequest request, Category category) {
        return new Product(request.getName(), request.getBrand(), request.getPrice(), request.getQuantity(), request.getDescription(), category);
    }

    @Override
    public Product getProductById(Long id) {
        return productRepository.findById(id).orElseThrow(ProductNotFoundException::new);
    }

    @Override
    public void deleteProductById(Long id) {
        Product p = getProductById(id);
        productRepository.delete(p);
    }

    @Override
    public Product updateProduct(UpdateProductRequest request, Long productId) {
        Product existing = productRepository.findById(productId)
                .orElseThrow(ProductNotFoundException::new);
        existing.setName(request.getName());
        existing.setBrand(request.getBrand());
        existing.setPrice(request.getPrice());
        existing.setQuantity(request.getQuantity());
        existing.setDescription(request.getDescription());
        Category cat = Optional.ofNullable(
                categoryRepository.findByName(request.getCategory().getName())
        ).orElseThrow(() -> new AppException(ErrorCode.CATEGORY_NOT_FOUND));
        existing.setCategory(cat);
        return productRepository.save(existing);
    }

    @Override
    public List<Product> getAllProducts() {
        return productRepository.findAll();
    }

    @Override
    public List<Product> getProductsByCategory(String category) {
        return productRepository.findByCategoryName(category);
    }

    @Override
    public List<Product> getProductsByBrand(String brand) {
        return productRepository.findByBrand(brand);
    }

    @Override
    public List<Product> getProductsByCategoryAndBrand(String category, String brand) {
        return productRepository.findByCategoryNameAndBrand(category, brand);
    }

    @Override
    public List<Product> getProductsByName(String name) {
        return productRepository.findByName(name);
    }

    @Override
    public List<Product> getProductsByBrandAndName(String brand, String name) {
        return productRepository.findByBrandAndName(brand, name);
    }

    @Override
    public List<Product> getProductsByCategoryAndName(String name, String category) {
        return productRepository.findByCategoryNameAndName(category, name);
    }

    @Override
    public Long countProductsByBrandAndName(String brand, String name) {
        return productRepository.countByBrandAndName(brand, name);
    }

    @Override
    public List<ProductDto> getConvertedProducts(List<Product> products) {
        return products.stream().map(this::convertToDto).toList();
    }

    @Override
    public ProductDto convertToDto(Product product) {
        ProductDto productDto = modelMapper.map(product, ProductDto.class);
        List<Image> images = imageRepository.findByProductId(product.getId());
        productDto.setImages(images.stream()
                .map(image -> modelMapper.map(image, ImageDto.class))
                .toList());
        return productDto;
    }
}

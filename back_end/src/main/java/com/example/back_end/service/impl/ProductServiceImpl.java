package com.example.back_end.service.impl;

import com.example.back_end.dto.request.product.ProductCreationRequest;
import com.example.back_end.dto.request.product.ProductUpdateRequest;
import com.example.back_end.dto.response.product.ProductDetailResponse;
import com.example.back_end.dto.response.product.ProductResponse;
import com.example.back_end.dto.response.product.ProductSummary;
import com.example.back_end.entity.*;
import com.example.back_end.exception.AppException;
import com.example.back_end.exception.ErrorCode;
import com.example.back_end.mapper.ProductMapper;
import com.example.back_end.repository.*;
import com.example.back_end.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;
    private final GenderRepository genderRepository;
    private final CategoryRepository categoryRepository;
    private final ProductMapper productMapper;

    @Override
    @Transactional
    public ProductResponse createProduct(ProductCreationRequest request) {
        if (productRepository.existsByNameAndBrandId(request.getName(), request.getBrandId())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTS);
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        Gender gender = request.getGenderId() != null ?
                genderRepository.findById(request.getGenderId())
                        .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND)) : null;

        List<Category> categories = categoryRepository.findByIdIn(request.getCategoryIds());

        Product product = productMapper.toEntity(request);
        product.setBrand(brand);
        product.setGender(gender);
        product.setCategories(categories);
        product.setActive(true);
        product.setFeatured(false);

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public ProductResponse updateProduct(Long id, ProductUpdateRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));

        if (!product.getName().equals(request.getName()) &&
            productRepository.existsByNameAndBrandId(request.getName(), request.getBrandId())) {
            throw new AppException(ErrorCode.PRODUCT_NAME_EXISTS);
        }

        Brand brand = brandRepository.findById(request.getBrandId())
                .orElseThrow(() -> new AppException(ErrorCode.BRAND_NOT_FOUND));

        Gender gender = request.getGenderId() != null ?
                genderRepository.findById(request.getGenderId())
                        .orElseThrow(() -> new AppException(ErrorCode.GENDER_NOT_FOUND)) : null;

        List<Category> categories = categoryRepository.findByIdIn(request.getCategoryIds());

        productMapper.updateFromRequest(request, product);
        product.setBrand(brand);
        product.setGender(gender);
        product.setCategories(categories);

        return productMapper.toResponse(productRepository.save(product));
    }

    @Override
    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(false);
        productRepository.save(product);
    }

    @Override
    public ProductDetailResponse getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        return productMapper.toDetailResponse(product);
    }

    @Override
    public Page<ProductSummary> getAllProducts(Pageable pageable) {
        return productRepository.findByActiveTrue(pageable)
                .map(productMapper::toSummary);
    }

    @Override
    public Page<ProductSummary> getFeaturedProducts(Pageable pageable) {
        return productRepository.findByFeaturedTrueAndActiveTrue(pageable)
                .map(productMapper::toSummary);
    }

    @Override
    public Page<ProductSummary> searchProducts(String keyword, Pageable pageable) {
        return productRepository.searchProducts(keyword, pageable)
                .map(productMapper::toSummary);
    }

    @Override
    public List<ProductSummary> getProductsByBrand(Long brandId) {
        return productRepository.findByBrandIdAndActiveTrue(brandId)
                .stream()
                .map(productMapper::toSummary)
                .toList();
    }

    @Override
    public List<ProductSummary> getProductsByGender(Long genderId) {
        return productRepository.findByGenderIdAndActiveTrue(genderId)
                .stream()
                .map(productMapper::toSummary)
                .toList();
    }

    @Override
    public List<ProductSummary> getProductsByCategory(Long categoryId) {
        return productRepository.findByCategoriesIdAndActiveTrue(categoryId)
                .stream()
                .map(productMapper::toSummary)
                .toList();
    }

    @Override
    @Transactional
    public void toggleProductStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setActive(!product.isActive());
        productRepository.save(product);
    }

    @Override
    @Transactional
    public void toggleFeaturedStatus(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new AppException(ErrorCode.PRODUCT_NOT_FOUND));
        product.setFeatured(!product.isFeatured());
        productRepository.save(product);
    }
}
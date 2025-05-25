package com.example.back_end.controller;

import com.example.back_end.dto.request.category.CategoryCreationRequest;
import com.example.back_end.dto.request.category.UpdateCategoryRequest;
import com.example.back_end.dto.response.category.CategoryResponse;
import com.example.back_end.service.category.ICategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.data.domain.Pageable;
import com.example.back_end.dto.response.PageResponse;

import java.util.List;

@RestController
@RequestMapping("/categories")
@RequiredArgsConstructor
public class CategoryController {
    private final ICategoryService categoryService;

    /**
     * Method to create Category
     *
     * @param request: Category creation request containing name and description
     * @return JSON body contains Category info if created successfully
     */
    @PostMapping
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<CategoryResponse> createCategory(@RequestBody CategoryCreationRequest request) {
        return ResponseEntity.ok(categoryService.createCategory(request));
    }

    /**
     * Method to update Category
     *
     * @param id: Category's id
     * @param request: Category update request containing name and description
     * @return JSON body contains updated Category info
     */
    @PutMapping("/{id}")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<CategoryResponse> updateCategory(
            @PathVariable Long id,
            @RequestBody UpdateCategoryRequest request) {
        return ResponseEntity.ok(categoryService.updateCategory(id, request));
    }

    /**
     * Method to delete Category
     *
     * @param id: Category's id
     * @return JSON body contains Category info
     */
    @DeleteMapping("/{id}")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        categoryService.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get Category
     *
     * @param id: Category's id
     * @return JSON body contains Category info
     */
    @GetMapping("/{id}")
    public ResponseEntity<CategoryResponse> getCategoryById(@PathVariable Long id) {
        return ResponseEntity.ok(categoryService.getCategoryById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<CategoryResponse> getCategoryBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(categoryService.getCategoryBySlug(slug));
    }

    @GetMapping("/check-slug")
    public ResponseEntity<Boolean> checkSlugExists(@RequestParam String slug) {
        return ResponseEntity.ok(categoryService.existsBySlug(slug));
    }

    /**
     * Method to get all Categories with pagination
     *
     * @param pageable: Pagination parameters (page, size, sort)
     * @return JSON body contains paginated list of Category responses
     */
    @GetMapping
    public ResponseEntity<PageResponse<CategoryResponse>> getAllCategories(Pageable pageable) {
        return ResponseEntity.ok(categoryService.getAllCategories(pageable));
    }

    /**
     * Method to toggle Category's status
     * @param id: Category's id
     * @return changing the Category's status
     */
    @PatchMapping("/{id}/toggle")
    // @PreAuthorize("hasAuthority('SCOPE_ADMIN')")
    public ResponseEntity<Void> toggleCategoryStatus(@PathVariable Long id) {
        categoryService.toggleCategoryStatus(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * Method to get sub-categories by parent category ID
     *
     * @param parentId: Parent Category's id
     * @return JSON body contains list of sub-category responses
     */
    @GetMapping("/{parentId}/subcategories")
    public ResponseEntity<List<CategoryResponse>> getSubCategoriesByParentId(@PathVariable Long parentId) {
        // Note: You need to implement getSubCategoriesByParentId method in CategoryService
        // This is a placeholder endpoint.
        return ResponseEntity.ok(categoryService.getSubCategoriesByParentId(parentId));
    }

    /**
     * Method to get Category by name
     *
     * @param name: Category's name
     * @return JSON body contains Category info
     */
    @GetMapping("/name/{name}")
    public ResponseEntity<CategoryResponse> getCategoryByName(@PathVariable String name) {
        return ResponseEntity.ok(categoryService.getCategoryByName(name));
    }

    /**
     * Method to get Categories by gender
     *
     * @param genderId: ID của giới tính
     * @return JSON body chứa danh sách các danh mục thuộc giới tính đó
     */
    @GetMapping("/gender/{genderId}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByGender(@PathVariable Long genderId) {
        return ResponseEntity.ok(categoryService.getCategoriesByGender(genderId));
    }

    /**
     * Method to get Categories by gender slug
     *
     * @param genderSlug: Slug của giới tính (nam/nu)
     * @return JSON body chứa danh sách các danh mục thuộc giới tính đó
     */
    @GetMapping("/gender/slug/{genderSlug}")
    public ResponseEntity<List<CategoryResponse>> getCategoriesByGenderSlug(@PathVariable String genderSlug) {
        return ResponseEntity.ok(categoryService.getCategoriesByGenderSlug(genderSlug));
    }
}
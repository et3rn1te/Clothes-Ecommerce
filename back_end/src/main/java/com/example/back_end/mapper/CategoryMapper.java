package com.example.back_end.mapper;

import com.example.back_end.dto.response.category.*;
import com.example.back_end.entity.Category;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.Named;

import java.util.List;

@Mapper(componentModel = "spring")
public interface CategoryMapper {
    @Mapping(target = "parentId", source = "parent", qualifiedByName = "parentToId")
    CategoryResponse toResponse(Category category);

    @Mapping(target = "parentId", source = "parent", qualifiedByName = "parentToId")
    @Mapping(target = "parentName", source = "parent.name")
    CategorySummary toSummary(Category category);

    List<CategorySummary> toSummaryList(List<Category> categories);

    List<CategoryResponse> toResponseList(List<Category> categories);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "parent", ignore = true)
    @Mapping(target = "subcategories", ignore = true)
    @Mapping(target = "products", ignore = true)
    void updateCategoryFromResponse(CategoryResponse Response, @MappingTarget Category category);

    @Named("parentToId")
    default Long parentToId(Category parent) {
        return parent != null ? parent.getId() : null;
    }
}
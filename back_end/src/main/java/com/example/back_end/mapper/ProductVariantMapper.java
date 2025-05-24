package com.example.back_end.mapper;

import com.example.back_end.dto.request.product.ProductVariantCreationRequest;
import com.example.back_end.dto.request.product.ProductVariantUpdateRequest;
import com.example.back_end.dto.response.product.ProductVariantResponse;
import com.example.back_end.dto.response.product.ProductVariantSummary;
import com.example.back_end.dto.response.ColorSummary;
import com.example.back_end.dto.response.SizeSummary;
import com.example.back_end.entity.ProductVariant;
import org.mapstruct.*;

import java.util.List;

@Mapper(componentModel = "spring",
        uses = {SizeMapper.class, ColorMapper.class, ProductImageMapper.class})
public interface ProductVariantMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "color.id", source = "colorId")
    @Mapping(target = "size.id", source = "sizeId")
    ProductVariant toEntity(ProductVariantCreationRequest request);

    @Mapping(target = "size", source = "size")
    @Mapping(target = "color", source = "color")
    @Mapping(target = "images", source = "images")
    ProductVariantSummary toSummary(ProductVariant variant);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "color.id", ignore = true)
    @Mapping(target = "size.id", ignore = true)
    void updateVariantFromRequest(ProductVariantUpdateRequest request, @MappingTarget ProductVariant variant);

    @Mapping(target = "color", source = "color")
    @Mapping(target = "size", source = "size")
    ProductVariantResponse toResponse(ProductVariant variant);

    List<ProductVariantResponse> toResponseList(List<ProductVariant> variants);

    List<ProductVariantSummary> toSummaryList(List<ProductVariant> variants);

    @AfterMapping
    default void mapVariantAssociations(ProductVariantCreationRequest request, @MappingTarget ProductVariant variant) {
        if (request.getColorId() != null) {
            variant.getColor().setId(request.getColorId());
        }
        if (request.getSizeId() != null) {
            variant.getSize().setId(request.getSizeId());
        }
    }
}
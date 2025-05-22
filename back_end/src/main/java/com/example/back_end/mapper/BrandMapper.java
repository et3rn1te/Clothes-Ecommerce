package com.example.back_end.mapper;

import com.example.back_end.dto.response.BrandSummary;
import com.example.back_end.entity.Brand;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "logoUrl", source = "logoUrl")
    BrandSummary toSummary(Brand brand);
}
package com.example.back_end.mapper;

import com.example.back_end.dto.BrandDto;
import com.example.back_end.entity.Brand;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface BrandMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "logoUrl", source = "logoUrl")
    BrandDto toDto(Brand brand);
}
package com.example.back_end.mapper;

import com.example.back_end.dto.response.SizeSummary;
import com.example.back_end.entity.Size;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface SizeMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    SizeSummary toSummary(Size size);
}

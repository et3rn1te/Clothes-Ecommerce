package com.example.back_end.mapper;

import com.example.back_end.dto.response.ColorSummary;
import com.example.back_end.entity.Color;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface ColorMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    @Mapping(target = "hexCode", source = "hexCode")
    ColorSummary toSummary(Color color);
}
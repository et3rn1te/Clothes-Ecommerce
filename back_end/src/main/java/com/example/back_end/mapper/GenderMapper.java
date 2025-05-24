package com.example.back_end.mapper;

import com.example.back_end.dto.response.GenderSummary;
import com.example.back_end.entity.Gender;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface GenderMapper {
    @Mapping(target = "id", source = "id")
    @Mapping(target = "name", source = "name")
    GenderSummary oSummary(Gender gender);
}
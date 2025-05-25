package com.example.back_end.mapper;

import com.example.back_end.dto.GenderDto;
import com.example.back_end.entity.Gender;
import org.springframework.stereotype.Component;

@Component
public class GenderMapper {
    
    public GenderDto toDto(Gender gender) {
        if (gender == null) {
            return null;
        }
        
        return GenderDto.builder()
                .id(gender.getId())
                .name(gender.getName())
                .description(gender.getDescription())
                .slug(gender.getSlug())
                .build();
    }

    public Gender toEntity(GenderDto dto) {
        if (dto == null) {
            return null;
        }

        return Gender.builder()
                .id(dto.getId())
                .name(dto.getName())
                .description(dto.getDescription())
                .slug(dto.getSlug())
                .build();
    }
}
package com.example.back_end.dto.response;

import lombok.*;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ColorSummary {
    private Long id;
    private String name;
    private String hexCode;
}
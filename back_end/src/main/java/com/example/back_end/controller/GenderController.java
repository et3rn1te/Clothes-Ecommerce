package com.example.back_end.controller;

import com.example.back_end.dto.GenderDto;
import com.example.back_end.dto.response.category.CategorySummary;
import com.example.back_end.service.GenderService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/genders")
@RequiredArgsConstructor
public class GenderController {

    private final GenderService genderService;

    @GetMapping
    public ResponseEntity<List<GenderDto>> getAllGenders() {
        return ResponseEntity.ok(genderService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<GenderDto> getGenderById(@PathVariable Long id) {
        return ResponseEntity.ok(genderService.findById(id));
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<GenderDto> getGenderBySlug(@PathVariable String slug) {
        return ResponseEntity.ok(genderService.findBySlug(slug));
    }

    @GetMapping("/{id}/categories")
    public ResponseEntity<List<CategorySummary>> getCategoriesByGenderId(@PathVariable Long id) {
        return ResponseEntity.ok(genderService.getCategoriesByGenderId(id));
    }

    @GetMapping("/slug/{slug}/categories")
    public ResponseEntity<List<CategorySummary>> getCategoriesByGenderSlug(@PathVariable String slug) {
        return ResponseEntity.ok(genderService.getCategoriesByGenderSlug(slug));
    }
}

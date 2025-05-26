package com.example.back_end.controller;

import com.example.back_end.dto.ColorDto;
import com.example.back_end.service.IColorService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/colors")
@RequiredArgsConstructor
public class ColorController {
    private final IColorService colorService;

    @GetMapping
    public ResponseEntity<List<ColorDto>> getAllColors() {
        return ResponseEntity.ok(colorService.getAllColors());
    }

    @GetMapping("/{id}")
    public ResponseEntity<ColorDto> getColorById(@PathVariable Long id) {
        return ResponseEntity.ok(colorService.getColorById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<ColorDto> getColorByName(@PathVariable String name) {
        return ResponseEntity.ok(colorService.getColorByName(name));
    }
} 
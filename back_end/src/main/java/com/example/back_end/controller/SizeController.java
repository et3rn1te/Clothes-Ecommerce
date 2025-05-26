package com.example.back_end.controller;

import com.example.back_end.dto.SizeDto;
import com.example.back_end.service.ISizeService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/sizes")
@RequiredArgsConstructor
public class SizeController {
    private final ISizeService sizeService;

    @GetMapping
    public ResponseEntity<List<SizeDto>> getAllSizes() {
        return ResponseEntity.ok(sizeService.getAllSizes());
    }

    @GetMapping("/{id}")
    public ResponseEntity<SizeDto> getSizeById(@PathVariable Long id) {
        return ResponseEntity.ok(sizeService.getSizeById(id));
    }

    @GetMapping("/name/{name}")
    public ResponseEntity<SizeDto> getSizeByName(@PathVariable String name) {
        return ResponseEntity.ok(sizeService.getSizeByName(name));
    }
} 
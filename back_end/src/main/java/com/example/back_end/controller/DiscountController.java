package com.example.back_end.controller;

import com.example.back_end.dto.request.discount.DiscountCreationRequest;
import com.example.back_end.dto.request.discount.DiscountUpdateRequest;
import com.example.back_end.dto.response.ApiResponse;
import com.example.back_end.dto.response.discount.DiscountResponse;
import com.example.back_end.entity.Discount;
import com.example.back_end.service.Discount.DiscountService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/discount")
public class DiscountController {
    private final DiscountService discountService;

    @GetMapping("/getDiscount")
    public ApiResponse<Discount> getDiscount(@RequestParam String code) {
        Discount getDis = discountService.findByCode(code);
        return ApiResponse.<Discount>builder().result(getDis).build();
    }

    @PostMapping
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<DiscountResponse> createDiscount(@RequestBody DiscountCreationRequest request) {
        return ResponseEntity.ok(discountService.createDiscount(request));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<DiscountResponse> updateDiscount(
            @PathVariable Long id,
            @RequestBody DiscountUpdateRequest request) {
        return ResponseEntity.ok(discountService.updateDiscount(id, request));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyAuthority('SCOPE_ADMIN', 'SCOPE_MANAGER')")
    public ResponseEntity<Void> deleteDiscount(@PathVariable Long id) {
        discountService.deleteDiscount(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<DiscountResponse>> getAllDiscounts() {
        return ResponseEntity.ok(discountService.getAllDiscounts());
    }

    @GetMapping("/{id}")
    public ResponseEntity<DiscountResponse> getDiscountById(@PathVariable Long id) {
        return ResponseEntity.ok(discountService.getDiscountById(id));
    }
}

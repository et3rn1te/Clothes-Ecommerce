package com.example.back_end.model.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name = "product_variants")
public class ProductVariant {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long variantId;

    @ManyToOne
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(nullable = false)
    private String size;

    @Column(nullable = false)
    private String color;

    private Integer stockQuantity = 0;

    @Column(unique = true)
    private String sku;

    @OneToMany(mappedBy = "variant")
    private Set<CartItem> cartItems = new HashSet<>();

    @OneToMany(mappedBy = "variant")
    private Set<OrderItem> orderItems = new HashSet<>();
}
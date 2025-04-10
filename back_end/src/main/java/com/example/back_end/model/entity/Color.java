package com.example.back_end.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "colors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Color {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "color_id")
    private Integer id;

    @Column(name = "color_name", nullable = false, unique = true, length = 20)
    private String name;

    @Column(name = "hex_code", length = 7)
    private String hexCode;

    @OneToMany(mappedBy = "color")
    private Set<ProductInventory> inventories = new HashSet<>();
}
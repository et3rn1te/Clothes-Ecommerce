package com.example.back_end.entity;

import jakarta.persistence.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@Entity
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users")
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false)
    private Long id;

    @Column(name = "username", nullable = false)
    private String username;

    @Column(name = "password", nullable = false)
    private String password;

    @Column(name = "fullname", nullable = false)
    private String fullname;

    @Column(name = "email", unique = true, nullable = false, length = 45)
    private String email;

    @Column(name = "phone", nullable = false, length = 20)
    private String phone;

    @OneToOne(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    private Image avatar;

    @Column(nullable = true)
    private String imageUrl;

    @Column(name = "active", nullable = false)
    private Boolean active = false;

    @ManyToMany
    private Set<Role> roles;
}

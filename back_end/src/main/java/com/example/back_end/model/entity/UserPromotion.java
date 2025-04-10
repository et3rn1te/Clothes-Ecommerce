package com.example.back_end.model.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_promotions")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPromotion {
    @EmbeddedId
    private UserPromotionId id = new UserPromotionId();

    @ManyToOne
    @MapsId("userId")
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne
    @MapsId("promotionId")
    @JoinColumn(name = "promotion_id")
    private Promotion promotion;

    @Column(name = "used_at")
    private LocalDateTime usedAt;
}
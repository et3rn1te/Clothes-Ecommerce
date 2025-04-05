package com.example.back_end.model.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Embeddable;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.io.Serializable;

@Embeddable
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserPromotionId implements Serializable {
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "promotion_id")
    private Integer promotionId;
}
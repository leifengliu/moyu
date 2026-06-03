package com.moyucoffee.module.coupon.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CouponCalcResult {
    private Long userCouponId;
    private BigDecimal discountAmount;
    private String name;
}

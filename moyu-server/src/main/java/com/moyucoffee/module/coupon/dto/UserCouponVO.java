package com.moyucoffee.module.coupon.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class UserCouponVO {
    private Long id;
    private Long couponId;
    private String name;
    private String type;
    private BigDecimal discountValue;
    private BigDecimal minAmount;
    private String status;
    private String expireTime;
}

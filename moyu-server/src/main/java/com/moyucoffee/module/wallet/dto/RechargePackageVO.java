package com.moyucoffee.module.wallet.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class RechargePackageVO {
    private Long id;
    private BigDecimal amount;
    private BigDecimal bonus;
    private Integer isRecommend;
}

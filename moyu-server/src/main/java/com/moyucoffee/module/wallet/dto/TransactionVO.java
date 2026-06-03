package com.moyucoffee.module.wallet.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class TransactionVO {
    private Long id;
    private String type;
    private BigDecimal amount;
    private BigDecimal balanceAfter;
    private String description;
    private String createTime;
}

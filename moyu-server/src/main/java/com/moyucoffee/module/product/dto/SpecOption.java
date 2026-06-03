package com.moyucoffee.module.product.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SpecOption {
    private String specValue;
    private BigDecimal priceAdjust;
}

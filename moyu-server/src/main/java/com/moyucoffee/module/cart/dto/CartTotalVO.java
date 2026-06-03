package com.moyucoffee.module.cart.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class CartTotalVO {
    private List<CartVO> items;
    private BigDecimal totalAmount;
    private int totalItems;
}

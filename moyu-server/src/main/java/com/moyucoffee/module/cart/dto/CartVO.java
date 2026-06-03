package com.moyucoffee.module.cart.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class CartVO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private Integer quantity;
    private String size;
    private String temp;
    private String sugar;
    private BigDecimal price;
    private Integer checked;
}

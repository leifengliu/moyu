package com.moyucoffee.module.order.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class OrderItemVO {
    private Long id;
    private Long productId;
    private String productName;
    private String productImage;
    private String size;
    private String temp;
    private String sugar;
    private BigDecimal price;
    private Integer quantity;
    private BigDecimal subtotal;
}

package com.moyucoffee.module.order.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("ord_order_item")
public class OrderItem {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long orderId;
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

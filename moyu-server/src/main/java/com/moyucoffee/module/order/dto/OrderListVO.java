package com.moyucoffee.module.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderListVO {
    private Long id;
    private String orderNo;
    private String status;
    private String statusText;
    private String createTime;
    private BigDecimal totalAmount;
    private List<OrderItemVO> items;
}

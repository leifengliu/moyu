package com.moyucoffee.module.order.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class OrderVO {
    private Long id;
    private String orderNo;
    private String status;
    private String statusText;
    private BigDecimal totalAmount;
    private BigDecimal discountAmount;
    private BigDecimal payAmount;
    private String payType;
    private String pickupCode;
    private String remark;
    private String createTime;
    private List<OrderItemVO> items;
    private StoreInfo storeInfo;
}

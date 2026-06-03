package com.moyucoffee.module.order.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class OrderSubmitRequest {
    @NotNull(message = "支付方式不能为空")
    private String payType;
    private Long couponId;
    private String remark;
}

package com.moyucoffee.module.wallet.dto;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class RechargeRequest {
    @NotNull(message = "套餐ID不能为空")
    private Long packageId;
}

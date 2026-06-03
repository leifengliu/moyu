package com.moyucoffee.module.wallet.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
@TableName("wlt_recharge_package")
public class RechargePackage {
    @TableId(type = IdType.AUTO)
    private Long id;
    private BigDecimal amount;
    private BigDecimal bonus;
    private Integer isRecommend;
    private Integer status;
    private Integer sortOrder;
    private LocalDateTime createTime;
}

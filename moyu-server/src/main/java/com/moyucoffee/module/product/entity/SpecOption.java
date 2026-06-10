package com.moyucoffee.module.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("prd_spec_option")
public class SpecOption {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long groupId;
    private String value;
    private BigDecimal priceAdjust;
    private Integer sortOrder;
}

package com.moyucoffee.module.product.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.math.BigDecimal;

@Data
@TableName("prd_product_spec")
public class ProductSpec {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long productId;
    private String specType;
    private String specValue;
    private BigDecimal priceAdjust;
    private Integer sortOrder;
}

package com.moyucoffee.module.product.dto;

import lombok.Data;

import java.math.BigDecimal;
import java.util.List;

@Data
public class ProductVO {
    private Long id;
    private Long categoryId;
    private String name;
    private String description;
    private String imageUrl;
    private BigDecimal basePrice;
    private Integer isRecommend;
    private Integer isNew;
    private Integer salesCount;
    private List<SpecGroup> specs;
}

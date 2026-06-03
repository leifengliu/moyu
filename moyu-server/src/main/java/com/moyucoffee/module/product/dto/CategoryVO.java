package com.moyucoffee.module.product.dto;

import lombok.Data;

@Data
public class CategoryVO {
    private Long id;
    private String name;
    private String code;
    private Integer sortOrder;
    private String icon;
}

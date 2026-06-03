package com.moyucoffee.module.product.dto;

import lombok.Data;

@Data
public class SpecGroup {
    private String specType;
    private java.util.List<SpecOption> options;
}

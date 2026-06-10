package com.moyucoffee.module.product.dto;

import lombok.Data;

import java.util.List;

@Data
public class SpecGroup {
    private String specType;
    private String selectionType;
    private List<SpecOption> options;
}

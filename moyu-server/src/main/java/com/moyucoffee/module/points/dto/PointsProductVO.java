package com.moyucoffee.module.points.dto;

import lombok.Data;

@Data
public class PointsProductVO {
    private Long id;
    private String name;
    private String imageUrl;
    private Integer points;
    private Integer stock;
}

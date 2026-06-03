package com.moyucoffee.module.points.dto;

import lombok.Data;

@Data
public class PointsRecordVO {
    private Long id;
    private String type;
    private Integer points;
    private Integer balanceAfter;
    private String description;
    private String createTime;
}

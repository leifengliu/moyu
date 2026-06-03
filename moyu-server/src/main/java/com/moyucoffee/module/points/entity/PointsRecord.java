package com.moyucoffee.module.points.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("pts_record")
public class PointsRecord {
    @TableId(type = IdType.AUTO)
    private Long id;
    private Long userId;
    private String type;
    private Integer points;
    private Integer balanceAfter;
    private String description;
    private Long orderId;
    private LocalDateTime createTime;
}

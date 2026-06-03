package com.moyucoffee.module.points.entity;

import com.baomidou.mybatisplus.annotation.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@TableName("pts_product")
public class PointsProduct {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String name;
    private String imageUrl;
    private Integer points;
    private Integer stock;
    private Integer status;
    @TableField(fill = FieldFill.INSERT)
    private LocalDateTime createTime;
    @TableField(fill = FieldFill.INSERT_UPDATE)
    private LocalDateTime updateTime;
}

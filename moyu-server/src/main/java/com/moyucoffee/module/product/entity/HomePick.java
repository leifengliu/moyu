package com.moyucoffee.module.product.entity;

import com.baomidou.mybatisplus.annotation.IdType;
import com.baomidou.mybatisplus.annotation.TableId;
import com.baomidou.mybatisplus.annotation.TableName;
import lombok.Data;

@Data
@TableName("cfg_home_pick")
public class HomePick {
    @TableId(type = IdType.AUTO)
    private Long id;
    private String section;
    private Long productId;
    private Integer sortOrder;
}

package com.moyucoffee.module.points.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.moyucoffee.module.points.entity.PointsProduct;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface PointsProductMapper extends BaseMapper<PointsProduct> {
    @Update("UPDATE pts_product SET stock = stock - 1 WHERE id = #{id} AND stock > 0")
    int deductStock(Long id);
}

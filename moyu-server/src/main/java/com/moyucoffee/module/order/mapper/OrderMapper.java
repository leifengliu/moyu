package com.moyucoffee.module.order.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.moyucoffee.module.order.entity.Order;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface OrderMapper extends BaseMapper<Order> {
    @Select("SELECT * FROM ord_order WHERE order_no = #{orderNo}")
    Order selectByOrderNo(String orderNo);

    @Select("SELECT COUNT(*) FROM ord_order WHERE store_id = #{storeId} AND pickup_code = #{code} AND DATE(create_time) = CURDATE()")
    int countPickupCode(Long storeId, String code);
}

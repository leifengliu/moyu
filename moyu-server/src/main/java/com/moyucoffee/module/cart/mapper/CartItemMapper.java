package com.moyucoffee.module.cart.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.moyucoffee.module.cart.entity.CartItem;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface CartItemMapper extends BaseMapper<CartItem> {
    @Update("DELETE FROM crt_cart_item WHERE user_id = #{userId} AND checked = 1")
    int deleteCheckedByUserId(Long userId);

    @Update("DELETE FROM crt_cart_item WHERE user_id = #{userId}")
    int deleteAllByUserId(Long userId);
}

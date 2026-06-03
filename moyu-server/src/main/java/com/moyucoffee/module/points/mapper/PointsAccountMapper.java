package com.moyucoffee.module.points.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.moyucoffee.module.points.entity.PointsAccount;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

@Mapper
public interface PointsAccountMapper extends BaseMapper<PointsAccount> {
    @Select("SELECT * FROM pts_account WHERE user_id = #{userId}")
    PointsAccount selectByUserId(Long userId);

    @Update("UPDATE pts_account SET balance = balance + #{points}, total_earned = total_earned + #{points} WHERE user_id = #{userId}")
    int addPoints(Long userId, Integer points);

    @Update("UPDATE pts_account SET balance = balance - #{points} WHERE user_id = #{userId} AND balance >= #{points}")
    int deductPoints(Long userId, Integer points);
}

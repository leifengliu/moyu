package com.moyucoffee.module.wallet.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.moyucoffee.module.wallet.entity.WalletAccount;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import java.math.BigDecimal;

@Mapper
public interface WalletAccountMapper extends BaseMapper<WalletAccount> {
    @Select("SELECT * FROM wlt_account WHERE user_id = #{userId}")
    WalletAccount selectByUserId(Long userId);

    @Update("UPDATE wlt_account SET balance = balance + #{amount}, total_recharge = total_recharge + #{amount} WHERE user_id = #{userId}")
    int addBalance(Long userId, BigDecimal amount);

    @Update("UPDATE wlt_account SET balance = balance - #{amount} WHERE user_id = #{userId} AND balance >= #{amount}")
    int deductBalance(Long userId, BigDecimal amount);
}

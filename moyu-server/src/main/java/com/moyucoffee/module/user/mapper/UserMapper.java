package com.moyucoffee.module.user.mapper;

import com.baomidou.mybatisplus.core.mapper.BaseMapper;
import com.moyucoffee.module.user.entity.User;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper extends BaseMapper<User> {
    @Select("SELECT * FROM sys_user WHERE openid = #{openid}")
    User selectByOpenid(String openid);

    @Select("SELECT * FROM sys_user WHERE phone = #{phone}")
    User selectByPhone(String phone);
}

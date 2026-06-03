package com.moyucoffee.module.user.dto;

import lombok.Data;

@Data
public class UserVO {
    private Long id;
    private String nickname;
    private String avatarUrl;
    private String phone;
    private String birthday;
    private int status;
    private int signInDays;
}

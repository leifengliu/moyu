package com.moyucoffee.module.user.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class WechatLoginRequest {
    @NotBlank(message = "code不能为空")
    private String code;
    private String phoneCode;
    private String nickname;
    private String avatarUrl;
}

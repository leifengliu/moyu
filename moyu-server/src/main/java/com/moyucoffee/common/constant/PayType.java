package com.moyucoffee.common.constant;

import lombok.Getter;

@Getter
public enum PayType {
    WECHAT("WECHAT", "微信支付"),
    WALLET("WALLET", "储值支付");

    private final String code;
    private final String desc;

    PayType(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }
}

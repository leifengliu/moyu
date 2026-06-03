package com.moyucoffee.common.constant;

import lombok.Getter;

@Getter
public enum OrderStatus {
    PENDING("pending", "待付款"),
    PAID("paid", "已支付"),
    PREPARING("preparing", "制作中"),
    READY("ready", "待取餐"),
    COMPLETED("completed", "已完成"),
    CANCELLED("cancelled", "已取消"),
    REFUNDING("refunding", "退款中"),
    REFUNDED("refunded", "已退款");

    private final String code;
    private final String desc;

    OrderStatus(String code, String desc) {
        this.code = code;
        this.desc = desc;
    }

    public static boolean canCancel(String status) {
        return PENDING.code.equals(status);
    }

    public static boolean canRefund(String status) {
        return PAID.code.equals(status) || PREPARING.code.equals(status);
    }
}

package com.moyucoffee.module.order.dto;

import lombok.Data;

@Data
public class StoreInfo {
    private Long storeId;
    private String storeName;
    private String storeAddress;
    private String storePhone;
}

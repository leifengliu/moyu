package com.moyucoffee.module.wallet.dto;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class WalletVO {
    private BigDecimal balance;
    private BigDecimal totalRecharge;
}

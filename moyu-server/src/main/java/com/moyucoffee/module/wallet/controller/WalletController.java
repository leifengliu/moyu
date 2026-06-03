package com.moyucoffee.module.wallet.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.wallet.dto.RechargeRequest;
import com.moyucoffee.module.wallet.service.WalletService;
import com.moyucoffee.security.UserContext;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "储值模块")
@RestController
@RequestMapping("/api/v1/wallet")
@RequiredArgsConstructor
public class WalletController {

    private final WalletService walletService;

    @GetMapping("/info")
    public Result<?> getWalletInfo() {
        return Result.success(walletService.getWalletInfo(UserContext.getCurrentUserId()));
    }

    @GetMapping("/packages")
    public Result<?> getPackages() {
        return Result.success(walletService.getPackages());
    }

    @GetMapping("/transactions")
    public Result<?> getTransactions(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(walletService.getTransactions(UserContext.getCurrentUserId(), page, size));
    }

    @PostMapping("/recharge")
    public Result<Void> recharge(@Valid @RequestBody RechargeRequest request) {
        walletService.recharge(UserContext.getCurrentUserId(), request.getPackageId());
        return Result.success();
    }
}

package com.moyucoffee.module.coupon.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.coupon.service.CouponService;
import com.moyucoffee.security.UserContext;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "优惠券模块")
@RestController
@RequestMapping("/api/v1/coupon")
@RequiredArgsConstructor
public class CouponController {

    private final CouponService couponService;

    @GetMapping("/list")
    public Result<?> getUserCoupons(@RequestParam(defaultValue = "all") String status) {
        return Result.success(couponService.getUserCoupons(UserContext.getCurrentUserId(), status));
    }

    @GetMapping("/available")
    public Result<?> getAvailableCoupons(@RequestParam java.math.BigDecimal orderAmount) {
        return Result.success(couponService.getAvailableCoupons(UserContext.getCurrentUserId(), orderAmount));
    }

    @PostMapping("/receive/{couponId}")
    public Result<Void> receiveCoupon(@PathVariable Long couponId) {
        couponService.receiveCoupon(UserContext.getCurrentUserId(), couponId);
        return Result.success();
    }
}

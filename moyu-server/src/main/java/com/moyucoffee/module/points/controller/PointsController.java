package com.moyucoffee.module.points.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.points.service.PointsService;
import com.moyucoffee.security.UserContext;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "积分模块")
@RestController
@RequestMapping("/api/v1/points")
@RequiredArgsConstructor
public class PointsController {

    private final PointsService pointsService;

    @GetMapping("/info")
    public Result<?> getPointsInfo() {
        return Result.success(pointsService.getPointsInfo(UserContext.getCurrentUserId()));
    }

    @GetMapping("/records")
    public Result<?> getRecords(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size) {
        return Result.success(pointsService.getRecords(UserContext.getCurrentUserId(), page, size));
    }

    @GetMapping("/products")
    public Result<?> getProducts() {
        return Result.success(pointsService.getProducts());
    }

    @PostMapping("/redeem/{productId}")
    public Result<Void> redeem(@PathVariable Long productId) {
        pointsService.redeem(UserContext.getCurrentUserId(), productId);
        return Result.success();
    }
}

package com.moyucoffee.module.order.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.order.dto.OrderSubmitRequest;
import com.moyucoffee.module.order.service.OrderService;
import com.moyucoffee.security.UserContext;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "订单模块")
@RestController
@RequestMapping("/api/v1/order")
@RequiredArgsConstructor
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/submit")
    public Result<?> submitOrder(@Valid @RequestBody OrderSubmitRequest request) {
        return Result.success(orderService.submitOrder(UserContext.getCurrentUserId(), request));
    }

    @PostMapping("/{id}/pay")
    public Result<?> payOrder(@PathVariable Long id) {
        return Result.success(orderService.payOrder(UserContext.getCurrentUserId(), id));
    }

    @PostMapping("/{id}/cancel")
    public Result<Void> cancelOrder(@PathVariable Long id) {
        orderService.cancelOrder(UserContext.getCurrentUserId(), id);
        return Result.success();
    }

    @PostMapping("/{id}/refund")
    public Result<Void> refundOrder(@PathVariable Long id) {
        orderService.refundOrder(UserContext.getCurrentUserId(), id);
        return Result.success();
    }

    @PostMapping("/{id}/reorder")
    public Result<?> reorder(@PathVariable Long id) {
        return Result.success(orderService.reorder(UserContext.getCurrentUserId(), id));
    }

    @GetMapping("/list")
    public Result<?> getOrderList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "10") Integer size,
            @RequestParam(defaultValue = "all") String status) {
        return Result.success(orderService.getOrderList(UserContext.getCurrentUserId(), page, size, status));
    }

    @GetMapping("/{id}")
    public Result<?> getOrderDetail(@PathVariable Long id) {
        return Result.success(orderService.getOrderDetail(UserContext.getCurrentUserId(), id));
    }
}

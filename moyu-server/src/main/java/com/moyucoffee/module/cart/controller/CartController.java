package com.moyucoffee.module.cart.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.cart.dto.CartAddRequest;
import com.moyucoffee.module.cart.service.CartService;
import com.moyucoffee.security.UserContext;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "购物车模块")
@RestController
@RequestMapping("/api/v1/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService cartService;

    @GetMapping("/list")
    public Result<?> getCartList() {
        return Result.success(cartService.getCartTotal(UserContext.getCurrentUserId()));
    }

    @PostMapping("/add")
    public Result<Void> addToCart(@Valid @RequestBody CartAddRequest request) {
        cartService.addToCart(UserContext.getCurrentUserId(), request);
        return Result.success();
    }

    @PutMapping("/{id}/quantity")
    public Result<Void> updateQuantity(@PathVariable Long id, @RequestBody java.util.Map<String, Integer> body) {
        Integer quantity = body.get("quantity");
        cartService.updateQuantity(UserContext.getCurrentUserId(), id, quantity);
        return Result.success();
    }

    @PutMapping("/{id}/check")
    public Result<Void> toggleCheck(@PathVariable Long id) {
        cartService.toggleCheck(UserContext.getCurrentUserId(), id);
        return Result.success();
    }

    @DeleteMapping("/{id}")
    public Result<Void> removeItem(@PathVariable Long id) {
        cartService.removeItem(UserContext.getCurrentUserId(), id);
        return Result.success();
    }

    @DeleteMapping("/clear")
    public Result<Void> clearChecked() {
        cartService.clearChecked(UserContext.getCurrentUserId());
        return Result.success();
    }
}

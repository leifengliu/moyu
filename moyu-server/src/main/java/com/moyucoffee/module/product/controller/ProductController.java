package com.moyucoffee.module.product.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.product.service.ProductService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "商品模块")
@RestController
@RequestMapping("/api/v1/product")
@RequiredArgsConstructor
public class ProductController {

    private final ProductService productService;

    @GetMapping("/categories")
    public Result<?> getCategories() {
        return Result.success(productService.getCategories());
    }

    @GetMapping("/list")
    public Result<?> getProductList(
            @RequestParam(defaultValue = "1") Integer page,
            @RequestParam(defaultValue = "20") Integer size,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        return Result.success(productService.getProductList(page, size, categoryId, keyword));
    }

    @GetMapping("/recommend")
    public Result<?> getRecommendProducts() {
        return Result.success(productService.getRecommendProducts());
    }

    @GetMapping("/search")
    public Result<?> search(@RequestParam String keyword) {
        return Result.success(productService.searchProducts(keyword));
    }

    @GetMapping("/{id}")
    public Result<?> getProductDetail(@PathVariable Long id) {
        return Result.success(productService.getProductDetail(id));
    }
}

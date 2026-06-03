package com.moyucoffee.module.store.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.store.service.StoreService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

@Tag(name = "门店模块")
@RestController
@RequestMapping("/api/v1/store")
@RequiredArgsConstructor
public class StoreController {

    private final StoreService storeService;

    @GetMapping("/{id}")
    public Result<?> getStore(@PathVariable Long id) {
        return Result.success(storeService.getStore(id));
    }

    @GetMapping("/list")
    public Result<?> getStoreList() {
        return Result.success(storeService.getStoreList());
    }
}

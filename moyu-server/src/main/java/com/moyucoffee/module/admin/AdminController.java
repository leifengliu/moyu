package com.moyucoffee.module.admin;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.config.CosService;
import com.moyucoffee.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/admin")
@RequiredArgsConstructor
public class AdminController {

    private final AdminService adminService;
    private final JwtTokenProvider jwtTokenProvider;
    private final CosService cosService;

    @Value("${admin.username:admin}")
    private String adminUser;
    @Value("${admin.password:admin123}")
    private String adminPass;

    @PostMapping("/login")
    public Result<?> login(@RequestBody Map<String, String> body) {
        String username = body.get("username");
        String password = body.get("password");
        if (adminUser.equals(username) && adminPass.equals(password)) {
            String token = jwtTokenProvider.generateToken(0L, "admin", "ADMIN");
            return Result.success(Map.of("token", token, "username", username));
        }
        return Result.error(401, "账号或密码错误");
    }

    @GetMapping("/stats")
    public Result<?> stats() {
        return Result.success(adminService.getStats());
    }

    // ==================== Categories ====================

    @GetMapping("/categories")
    public Result<?> categories() {
        return Result.success(adminService.getCategories());
    }

    @PostMapping("/categories")
    public Result<?> addCategory(@RequestBody Map<String, Object> body) {
        return Result.success(adminService.addCategory(body));
    }

    @PutMapping("/categories/{id}")
    public Result<?> updateCategory(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        adminService.updateCategory(id, body);
        return Result.success();
    }

    @DeleteMapping("/categories/{id}")
    public Result<?> deleteCategory(@PathVariable Long id) {
        adminService.deleteCategory(id);
        return Result.success();
    }

    // ==================== Spec Groups ====================

    @GetMapping("/spec-groups")
    public Result<?> specGroups() {
        return Result.success(adminService.getSpecGroups());
    }

    @PostMapping("/spec-groups")
    public Result<?> addSpecGroup(@RequestBody Map<String, Object> body) {
        return Result.success(adminService.addSpecGroup(body));
    }

    @PutMapping("/spec-groups/{id}")
    public Result<?> updateSpecGroup(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        adminService.updateSpecGroup(id, body);
        return Result.success();
    }

    @DeleteMapping("/spec-groups/{id}")
    public Result<?> deleteSpecGroup(@PathVariable Long id) {
        adminService.deleteSpecGroup(id);
        return Result.success();
    }

    @PostMapping("/spec-groups/{id}/options")
    public Result<?> addSpecOption(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        return Result.success(adminService.addSpecOption(id, body));
    }

    @PutMapping("/spec-options/{id}")
    public Result<?> updateSpecOption(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        adminService.updateSpecOption(id, body);
        return Result.success();
    }

    @DeleteMapping("/spec-options/{id}")
    public Result<?> deleteSpecOption(@PathVariable Long id) {
        adminService.deleteSpecOption(id);
        return Result.success();
    }

    // ==================== Products ====================

    @GetMapping("/products")
    public Result<?> products(@RequestParam(defaultValue = "1") int page,
                              @RequestParam(defaultValue = "50") int size) {
        return Result.success(adminService.getProducts(page, size));
    }

    @PostMapping("/products")
    public Result<?> addProduct(@RequestBody Map<String, Object> body) {
        adminService.addProduct(body);
        return Result.success();
    }

    @PostMapping("/upload")
    public Result<String> upload(@RequestParam("file") MultipartFile file) {
        String url = cosService.upload(file, "product");
        return Result.success(url);
    }

    @PutMapping("/products/{id}")
    public Result<?> updateProduct(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        adminService.updateProduct(id, body);
        return Result.success();
    }

    @DeleteMapping("/products/{id}")
    public Result<?> deleteProduct(@PathVariable Long id) {
        adminService.deleteProduct(id);
        return Result.success();
    }

    // ==================== Orders ====================

    @GetMapping("/orders")
    public Result<?> orders(@RequestParam(defaultValue = "1") int page,
                            @RequestParam(defaultValue = "50") int size,
                            @RequestParam(defaultValue = "all") String status) {
        return Result.success(adminService.getOrders(page, size, status));
    }

    @PutMapping("/orders/{id}/status")
    public Result<?> updateOrderStatus(@PathVariable Long id, @RequestBody Map<String, String> body) {
        adminService.updateOrderStatus(id, body.get("status"));
        return Result.success();
    }

    // ==================== Users ====================

    @GetMapping("/users")
    public Result<?> users(@RequestParam(defaultValue = "1") int page,
                           @RequestParam(defaultValue = "50") int size,
                           @RequestParam(required = false) String keyword) {
        return Result.success(adminService.getUsers(page, size, keyword));
    }
}

package com.moyucoffee.module.user.controller;

import com.moyucoffee.common.result.Result;
import com.moyucoffee.module.user.dto.*;
import com.moyucoffee.module.user.service.UserService;
import com.moyucoffee.security.UserContext;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@Tag(name = "用户模块")
@RestController
@RequestMapping("/api/v1/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @PostMapping("/login/wechat")
    public Result<Map<String, String>> wechatLogin(@Valid @RequestBody WechatLoginRequest request) {
        String token = userService.wechatLogin(request);
        return Result.success(Map.of("token", token));
    }

    @PostMapping("/login/phone")
    public Result<Map<String, String>> phoneLogin(@Valid @RequestBody LoginRequest request) {
        String token = userService.phoneLogin(request);
        return Result.success(Map.of("token", token));
    }

    @PostMapping("/sms/send")
    public Result<Void> sendSms(@Valid @RequestBody SendSmsRequest request) {
        userService.sendSms(request.getPhone());
        return Result.success();
    }

    @PostMapping("/avatar")
    public Result<String> uploadAvatar(@RequestParam("file") MultipartFile file) {
        String url = userService.uploadAvatar(UserContext.getCurrentUserId(), file);
        return Result.success(url);
    }

    @GetMapping("/info")
    public Result<?> getUserInfo() {
        return Result.success(userService.getUserInfo(UserContext.getCurrentUserId()));
    }

    @PutMapping("/info")
    public Result<?> updateUserInfo(@Valid @RequestBody UpdateUserRequest request) {
        return Result.success(userService.updateUserInfo(
                UserContext.getCurrentUserId(), request.getNickname(), request.getBirthday()));
    }

    @PostMapping("/phone")
    public Result<String> changePhone(@Valid @RequestBody ChangePhoneRequest request) {
        String phone = userService.changePhone(UserContext.getCurrentUserId(), request.getPhoneCode());
        return Result.success(phone);
    }

    @PostMapping("/sign-in")
    public Result<Map<String, Integer>> signIn() {
        int points = userService.signIn(UserContext.getCurrentUserId());
        return Result.success(Map.of("points", points));
    }
}

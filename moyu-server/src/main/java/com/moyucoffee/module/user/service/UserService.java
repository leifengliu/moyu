package com.moyucoffee.module.user.service;

import cn.binarywang.wx.miniapp.api.WxMaService;
import cn.binarywang.wx.miniapp.bean.WxMaJscode2SessionResult;
import cn.binarywang.wx.miniapp.bean.WxMaPhoneNumberInfo;
import com.moyucoffee.config.CosService;
import com.moyucoffee.common.exception.BusinessException;
import com.moyucoffee.module.user.dto.LoginRequest;
import com.moyucoffee.module.user.dto.UserVO;
import com.moyucoffee.module.user.dto.WechatLoginRequest;
import com.moyucoffee.module.user.entity.User;
import com.moyucoffee.module.user.mapper.UserMapper;
import com.moyucoffee.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.concurrent.TimeUnit;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserService {

    private final UserMapper userMapper;
    private final JwtTokenProvider jwtTokenProvider;
    private final WxMaService wxMaService;
    private final StringRedisTemplate redisTemplate;
    private final CosService cosService;

    private static final String SMS_KEY_PREFIX = "sms:login:";

    /**
     * 微信一键登录 (含手机号解密)
     */
    public String wechatLogin(WechatLoginRequest request) {
        try {
            WxMaJscode2SessionResult session = wxMaService.getUserService().getSessionInfo(request.getCode());
            String openid = session.getOpenid();

            // 解密手机号
            String phone = null;
            if (request.getPhoneCode() != null && !request.getPhoneCode().isEmpty()) {
                try {
                    WxMaPhoneNumberInfo phoneInfo = wxMaService.getUserService().getPhoneNoInfo(request.getPhoneCode());
                    phone = phoneInfo.getPhoneNumber();
                    log.info("微信手机号解密成功: {}", phone);
                } catch (Exception e) {
                    log.warn("手机号解密失败, 继续登录: {}", e.getMessage());
                }
            }

            User user = userMapper.selectByOpenid(openid);
            if (user == null) {
                user = new User();
                user.setOpenid(openid);
                user.setUnionid(session.getUnionid());
                user.setPhone(phone);
                user.setNickname(request.getNickname());
                user.setAvatarUrl(request.getAvatarUrl());
                user.setRegisterTime(LocalDateTime.now());
                userMapper.insert(user);
            } else {
                user.setLastLoginTime(LocalDateTime.now());
                if (phone != null) user.setPhone(phone);
                if (request.getNickname() != null) user.setNickname(request.getNickname());
                if (request.getAvatarUrl() != null) user.setAvatarUrl(request.getAvatarUrl());
                userMapper.updateById(user);
            }

            return jwtTokenProvider.generateToken(user.getId(), openid);
        } catch (Exception e) {
            log.error("微信登录失败", e);
            throw new BusinessException("微信登录失败: " + e.getMessage());
        }
    }

    /**
     * 上传用户头像
     */
    public String uploadAvatar(Long userId, MultipartFile file) {
        User user = userMapper.selectById(userId);
        if (user == null) throw new BusinessException("用户不存在");

        String avatarUrl = cosService.upload(file, "avatar");
        user.setAvatarUrl(avatarUrl);
        userMapper.updateById(user);
        return avatarUrl;
    }

    /**
     * 更新用户资料 (昵称、生日)
     */
    public UserVO updateUserInfo(Long userId, String nickname, String birthday) {
        User user = userMapper.selectById(userId);
        if (user == null) throw new BusinessException("用户不存在");
        if (nickname != null) user.setNickname(nickname);
        if (birthday != null) user.setBirthday(birthday);
        userMapper.updateById(user);
        return toVO(user);
    }

    /**
     * 更换手机号 (通过微信phoneCode解密)
     */
    public String changePhone(Long userId, String phoneCode) {
        try {
            WxMaPhoneNumberInfo phoneInfo = wxMaService.getUserService().getPhoneNoInfo(phoneCode);
            String phone = phoneInfo.getPhoneNumber();
            User user = userMapper.selectById(userId);
            if (user == null) throw new BusinessException("用户不存在");
            user.setPhone(phone);
            userMapper.updateById(user);
            return phone;
        } catch (Exception e) {
            log.error("更换手机号失败", e);
            throw new BusinessException("手机号更换失败");
        }
    }

    /**
     * 手机号+验证码登录
     */
    public String phoneLogin(LoginRequest request) {
        String key = SMS_KEY_PREFIX + request.getPhone();
        String cachedCode = redisTemplate.opsForValue().get(key);
        if (cachedCode == null || !cachedCode.equals(request.getCode())) {
            throw new BusinessException(400, "验证码错误或已过期");
        }
        redisTemplate.delete(key);

        User user = userMapper.selectByPhone(request.getPhone());
        if (user == null) {
            throw new BusinessException(400, "用户不存在，请先通过微信登录");
        }

        user.setPhone(request.getPhone());
        user.setLastLoginTime(LocalDateTime.now());
        userMapper.updateById(user);

        return jwtTokenProvider.generateToken(user.getId(), user.getOpenid());
    }

    /**
     * 发送短信验证码 (模拟: 固定123456)
     */
    public void sendSms(String phone) {
        String key = SMS_KEY_PREFIX + phone;
        Long ttl = redisTemplate.getExpire(key, TimeUnit.SECONDS);
        if (ttl != null && ttl > 240) {
            throw new BusinessException(400, "验证码已发送，请60秒后再试");
        }
        redisTemplate.opsForValue().set(key, "123456", 5, TimeUnit.MINUTES);
        log.info("短信验证码已发送至 {}: 123456", phone);
    }

    /**
     * 获取当前用户信息
     */
    public UserVO getUserInfo(Long userId) {
        User user = userMapper.selectById(userId);
        if (user == null) throw new BusinessException("用户不存在");
        return toVO(user);
    }

    /**
     * 每日签到
     */
    public int signIn(Long userId) {
        String key = "sign_in:" + userId + ":" + LocalDateTime.now().toLocalDate();
        Boolean exists = redisTemplate.hasKey(key);
        if (Boolean.TRUE.equals(exists)) {
            throw new BusinessException(400, "今日已签到");
        }
        redisTemplate.opsForValue().set(key, "1", 1, TimeUnit.DAYS);
        return 10;
    }

    private UserVO toVO(User user) {
        UserVO vo = new UserVO();
        vo.setId(user.getId());
        vo.setNickname(user.getNickname());
        vo.setAvatarUrl(user.getAvatarUrl());
        vo.setPhone(user.getPhone());
        vo.setBirthday(user.getBirthday());
        vo.setStatus(user.getStatus());
        vo.setSignInDays(30);
        return vo;
    }
}

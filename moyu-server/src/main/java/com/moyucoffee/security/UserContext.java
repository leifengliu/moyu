package com.moyucoffee.security;

import com.moyucoffee.common.exception.BusinessException;

public class UserContext {
    private static final ThreadLocal<Long> USER_ID = new ThreadLocal<>();
    private static final ThreadLocal<String> OPENID = new ThreadLocal<>();

    public static void setCurrentUser(Long userId, String openid) {
        USER_ID.set(userId);
        OPENID.set(openid);
    }

    public static Long getCurrentUserId() {
        Long userId = USER_ID.get();
        if (userId == null) {
            throw new BusinessException(401, "请先登录");
        }
        return userId;
    }

    public static String getCurrentOpenid() {
        return OPENID.get();
    }

    public static void clear() {
        USER_ID.remove();
        OPENID.remove();
    }
}

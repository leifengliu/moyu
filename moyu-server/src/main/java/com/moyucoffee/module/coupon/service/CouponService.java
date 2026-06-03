package com.moyucoffee.module.coupon.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.moyucoffee.common.exception.BusinessException;
import com.moyucoffee.module.coupon.dto.CouponCalcResult;
import com.moyucoffee.module.coupon.dto.UserCouponVO;
import com.moyucoffee.module.coupon.entity.Coupon;
import com.moyucoffee.module.coupon.entity.UserCoupon;
import com.moyucoffee.module.coupon.mapper.CouponMapper;
import com.moyucoffee.module.coupon.mapper.UserCouponMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CouponService {

    private final CouponMapper couponMapper;
    private final UserCouponMapper userCouponMapper;

    public List<UserCouponVO> getUserCoupons(Long userId, String status) {
        LambdaQueryWrapper<UserCoupon> wrapper = new LambdaQueryWrapper<UserCoupon>()
                .eq(UserCoupon::getUserId, userId)
                .orderByDesc(UserCoupon::getReceiveTime);

        if (status != null && !"all".equals(status)) {
            wrapper.eq(UserCoupon::getStatus, status);
        }

        return userCouponMapper.selectList(wrapper).stream().map(uc -> {
            Coupon coupon = couponMapper.selectById(uc.getCouponId());
            UserCouponVO vo = new UserCouponVO();
            vo.setId(uc.getId());
            vo.setCouponId(uc.getCouponId());
            vo.setName(coupon != null ? coupon.getName() : "");
            vo.setType(coupon != null ? coupon.getType() : "");
            vo.setDiscountValue(coupon != null ? coupon.getDiscountValue() : BigDecimal.ZERO);
            vo.setMinAmount(coupon != null ? coupon.getMinAmount() : BigDecimal.ZERO);
            vo.setStatus(uc.getStatus());
            vo.setExpireTime(uc.getExpireTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
            return vo;
        }).collect(Collectors.toList());
    }

    public List<UserCouponVO> getAvailableCoupons(Long userId, BigDecimal orderAmount) {
        List<UserCoupon> userCoupons = userCouponMapper.selectList(
                new LambdaQueryWrapper<UserCoupon>()
                        .eq(UserCoupon::getUserId, userId)
                        .eq(UserCoupon::getStatus, "UNUSED")
                        .gt(UserCoupon::getExpireTime, LocalDateTime.now())
        );

        return userCoupons.stream()
                .map(uc -> {
                    Coupon coupon = couponMapper.selectById(uc.getCouponId());
                    if (coupon == null) return null;
                    if (orderAmount.compareTo(coupon.getMinAmount()) < 0) return null;

                    UserCouponVO vo = new UserCouponVO();
                    vo.setId(uc.getId());
                    vo.setCouponId(uc.getCouponId());
                    vo.setName(coupon.getName());
                    vo.setType(coupon.getType());
                    vo.setDiscountValue(coupon.getDiscountValue());
                    vo.setMinAmount(coupon.getMinAmount());
                    vo.setStatus(uc.getStatus());
                    vo.setExpireTime(uc.getExpireTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd")));
                    return vo;
                })
                .filter(vo -> vo != null)
                .collect(Collectors.toList());
    }

    public CouponCalcResult calculateDiscount(Long userCouponId, BigDecimal orderAmount) {
        UserCoupon userCoupon = userCouponMapper.selectById(userCouponId);
        if (userCoupon == null || !"UNUSED".equals(userCoupon.getStatus())) {
            throw new BusinessException(400, "优惠券不可用");
        }

        Coupon coupon = couponMapper.selectById(userCoupon.getCouponId());
        if (coupon == null) {
            throw new BusinessException(400, "优惠券不存在");
        }
        if (orderAmount.compareTo(coupon.getMinAmount()) < 0) {
            throw new BusinessException(400, "未满足最低消费金额 ¥" + coupon.getMinAmount());
        }

        BigDecimal discount;
        if ("DISCOUNT".equals(coupon.getType())) {
            // 折扣券: discountValue是折扣率，8.00 = 8折
            BigDecimal rate = coupon.getDiscountValue().divide(BigDecimal.TEN, 2, RoundingMode.HALF_UP);
            discount = orderAmount.multiply(BigDecimal.ONE.subtract(rate)).setScale(2, RoundingMode.DOWN);
        } else {
            // 固定金额券
            discount = coupon.getDiscountValue().min(orderAmount);
        }

        CouponCalcResult result = new CouponCalcResult();
        result.setUserCouponId(userCouponId);
        result.setDiscountAmount(discount);
        result.setName(coupon.getName());
        return result;
    }

    @Transactional
    public void receiveCoupon(Long userId, Long couponId) {
        Coupon coupon = couponMapper.selectById(couponId);
        if (coupon == null || coupon.getStatus() == 0) {
            throw new BusinessException("优惠券不存在");
        }
        if (coupon.getReceivedCount() >= coupon.getTotalCount()) {
            throw new BusinessException(400, "优惠券已被领完");
        }

        // 检查是否已领取
        Long count = userCouponMapper.selectCount(
                new LambdaQueryWrapper<UserCoupon>()
                        .eq(UserCoupon::getUserId, userId)
                        .eq(UserCoupon::getCouponId, couponId));
        if (count > 0) {
            throw new BusinessException(400, "已领取过该优惠券");
        }

        UserCoupon uc = new UserCoupon();
        uc.setCouponId(couponId);
        uc.setUserId(userId);
        uc.setStatus("UNUSED");
        uc.setReceiveTime(LocalDateTime.now());
        uc.setExpireTime(LocalDateTime.now().plusDays(coupon.getValidDays()));
        userCouponMapper.insert(uc);

        coupon.setReceivedCount(coupon.getReceivedCount() + 1);
        couponMapper.updateById(coupon);
    }

    @Transactional
    public void useCoupon(Long userCouponId, Long orderId) {
        UserCoupon uc = userCouponMapper.selectById(userCouponId);
        if (uc == null) {
            throw new BusinessException("优惠券不存在");
        }
        uc.setStatus("USED");
        uc.setUseTime(LocalDateTime.now());
        uc.setOrderId(orderId);
        userCouponMapper.updateById(uc);
    }

    @Transactional
    public void returnCoupon(Long userCouponId) {
        UserCoupon uc = userCouponMapper.selectById(userCouponId);
        if (uc != null && "USED".equals(uc.getStatus())) {
            uc.setStatus("UNUSED");
            uc.setUseTime(null);
            uc.setOrderId(null);
            userCouponMapper.updateById(uc);
        }
    }
}

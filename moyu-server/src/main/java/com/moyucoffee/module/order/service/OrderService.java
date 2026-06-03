package com.moyucoffee.module.order.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.moyucoffee.common.constant.OrderStatus;
import com.moyucoffee.common.exception.BusinessException;
import com.moyucoffee.module.cart.dto.CartTotalVO;
import com.moyucoffee.module.cart.dto.CartVO;
import com.moyucoffee.module.cart.service.CartService;
import com.moyucoffee.module.coupon.dto.CouponCalcResult;
import com.moyucoffee.module.coupon.service.CouponService;
import com.moyucoffee.module.order.dto.*;
import com.moyucoffee.module.order.entity.Order;
import com.moyucoffee.module.order.entity.OrderItem;
import com.moyucoffee.module.order.mapper.OrderItemMapper;
import com.moyucoffee.module.order.mapper.OrderMapper;
import com.moyucoffee.module.points.service.PointsService;
import com.moyucoffee.module.product.entity.Product;
import com.moyucoffee.module.product.entity.ProductSpec;
import com.moyucoffee.module.product.mapper.ProductMapper;
import com.moyucoffee.module.product.mapper.ProductSpecMapper;
import com.moyucoffee.module.store.entity.Store;
import com.moyucoffee.module.store.mapper.StoreMapper;
import com.moyucoffee.module.wallet.service.WalletService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Random;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class OrderService {

    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final ProductMapper productMapper;
    private final ProductSpecMapper productSpecMapper;
    private final StoreMapper storeMapper;
    private final CartService cartService;
    private final WalletService walletService;
    private final PointsService pointsService;
    private final CouponService couponService;

    /**
     * 提交订单
     */
    @Transactional
    public OrderVO submitOrder(Long userId, OrderSubmitRequest request) {
        CartTotalVO cartTotal = cartService.getCartTotal(userId);
        List<CartVO> checkedItems = cartTotal.getItems().stream()
                .filter(i -> i.getChecked() == 1)
                .collect(Collectors.toList());

        if (checkedItems.isEmpty()) {
            throw new BusinessException(400, "请选择要结算的商品");
        }

        // 计算优惠
        BigDecimal totalAmount = cartTotal.getTotalAmount();
        BigDecimal discountAmount = BigDecimal.ZERO;
        Long userCouponId = null;

        if (request.getCouponId() != null) {
            CouponCalcResult calcResult = couponService.calculateDiscount(request.getCouponId(), totalAmount);
            discountAmount = calcResult.getDiscountAmount();
            userCouponId = calcResult.getUserCouponId();
        }

        BigDecimal payAmount = totalAmount.subtract(discountAmount);

        // 创建订单
        Order order = new Order();
        order.setOrderNo(generateOrderNo());
        order.setUserId(userId);
        order.setStoreId(1L);
        order.setStatus(OrderStatus.PENDING.getCode());
        order.setTotalAmount(totalAmount);
        order.setDiscountAmount(discountAmount);
        order.setPayAmount(payAmount);
        order.setPayType(request.getPayType());
        order.setCouponId(userCouponId);
        order.setRemark(request.getRemark());
        orderMapper.insert(order);

        // 创建订单商品项
        for (CartVO item : checkedItems) {
            OrderItem orderItem = new OrderItem();
            orderItem.setOrderId(order.getId());
            orderItem.setProductId(item.getProductId());
            orderItem.setProductName(item.getProductName());
            orderItem.setProductImage(item.getProductImage());
            orderItem.setSize(item.getSize());
            orderItem.setTemp(item.getTemp());
            orderItem.setSugar(item.getSugar());
            orderItem.setPrice(item.getPrice());
            orderItem.setQuantity(item.getQuantity());
            orderItem.setSubtotal(item.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
            orderItemMapper.insert(orderItem);
        }

        // 清除购物车已勾选项
        cartService.clearChecked(userId);

        return toVO(order);
    }

    /**
     * 支付订单
     */
    @Transactional
    public OrderVO payOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (!OrderStatus.PENDING.getCode().equals(order.getStatus())) {
            throw new BusinessException(400, "订单状态不允许支付");
        }

        if ("WALLET".equals(order.getPayType())) {
            // 储值支付
            walletService.deduct(userId, order.getPayAmount(), order.getId(),
                    "订单支付 " + order.getOrderNo());
        } else {
            // 微信支付 (模拟)
            log.info("模拟微信支付: 订单 {} 金额 {}", order.getOrderNo(), order.getPayAmount());
        }

        // 使用优惠券
        if (order.getCouponId() != null) {
            couponService.useCoupon(order.getCouponId(), order.getId());
        }

        order.setStatus(OrderStatus.PAID.getCode());
        order.setPayTime(LocalDateTime.now());
        orderMapper.updateById(order);

        // 支付成功赠送积分
        int earnedPoints = order.getPayAmount().intValue();
        pointsService.addPoints(userId, earnedPoints, "ORDER", order.getId(),
                "消费获积分 订单#" + order.getOrderNo());

        return toVO(order);
    }

    /**
     * 取消订单
     */
    @Transactional
    public void cancelOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (!OrderStatus.canCancel(order.getStatus())) {
            throw new BusinessException(400, "当前状态不可取消");
        }

        order.setStatus(OrderStatus.CANCELLED.getCode());
        orderMapper.updateById(order);

        // 退还优惠券
        if (order.getCouponId() != null) {
            couponService.returnCoupon(order.getCouponId());
        }
    }

    /**
     * 申请退款
     */
    @Transactional
    public void refundOrder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        if (!OrderStatus.canRefund(order.getStatus())) {
            throw new BusinessException(400, "当前状态不可退款");
        }

        order.setStatus(OrderStatus.REFUNDING.getCode());
        orderMapper.updateById(order);

        // 模拟退款到账
        order.setStatus(OrderStatus.REFUNDED.getCode());
        orderMapper.updateById(order);

        // 储值支付则退回余额
        if ("WALLET".equals(order.getPayType())) {
            walletService.refund(userId, order.getPayAmount(), order.getId(),
                    "退款 " + order.getOrderNo());
        }

        // 退回积分
        int refundPoints = order.getPayAmount().intValue();
        pointsService.addPoints(userId, -refundPoints, "REFUND", order.getId(),
                "退款扣回积分 订单#" + order.getOrderNo());
    }

    /**
     * 再来一单
     */
    @Transactional
    public String reorder(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }

        List<OrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, orderId));

        // 直接创建新订单
        Order newOrder = new Order();
        newOrder.setOrderNo(generateOrderNo());
        newOrder.setUserId(userId);
        newOrder.setStoreId(order.getStoreId());
        newOrder.setStatus(OrderStatus.PENDING.getCode());
        newOrder.setTotalAmount(order.getTotalAmount());
        newOrder.setPayAmount(order.getPayAmount());
        orderMapper.insert(newOrder);

        for (OrderItem item : items) {
            OrderItem newItem = new OrderItem();
            newItem.setOrderId(newOrder.getId());
            newItem.setProductId(item.getProductId());
            newItem.setProductName(item.getProductName());
            newItem.setProductImage(item.getProductImage());
            newItem.setSize(item.getSize());
            newItem.setTemp(item.getTemp());
            newItem.setSugar(item.getSugar());
            newItem.setPrice(item.getPrice());
            newItem.setQuantity(item.getQuantity());
            newItem.setSubtotal(item.getSubtotal());
            orderItemMapper.insert(newItem);
        }

        return newOrder.getOrderNo();
    }

    /**
     * 订单列表
     */
    public Page<OrderListVO> getOrderList(Long userId, Integer page, Integer size, String status) {
        Page<Order> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Order> wrapper = new LambdaQueryWrapper<Order>()
                .eq(Order::getUserId, userId)
                .orderByDesc(Order::getCreateTime);

        if (status != null && !"all".equals(status)) {
            wrapper.eq(Order::getStatus, status);
        }

        Page<Order> result = orderMapper.selectPage(pageParam, wrapper);
        List<OrderListVO> vos = result.getRecords().stream().map(order -> {
            OrderListVO vo = new OrderListVO();
            vo.setId(order.getId());
            vo.setOrderNo(order.getOrderNo());
            vo.setStatus(order.getStatus());
            vo.setStatusText(OrderStatus.valueOf(order.getStatus().toUpperCase()).getDesc());
            vo.setCreateTime(order.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            vo.setTotalAmount(order.getTotalAmount());

            List<OrderItem> items = orderItemMapper.selectList(
                    new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, order.getId()));
            vo.setItems(items.stream().map(this::toItemVO).collect(Collectors.toList()));
            return vo;
        }).collect(Collectors.toList());

        Page<OrderListVO> voPage = new Page<>(page, size, result.getTotal());
        voPage.setRecords(vos);
        return voPage;
    }

    /**
     * 订单详情
     */
    public OrderVO getOrderDetail(Long userId, Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null || !order.getUserId().equals(userId)) {
            throw new BusinessException("订单不存在");
        }
        return toVO(order);
    }

    /**
     * 生成取餐码 (店员操作)
     */
    @Transactional
    public String generatePickupCode(Long orderId) {
        Order order = orderMapper.selectById(orderId);
        if (order == null) {
            throw new BusinessException("订单不存在");
        }

        String code;
        Random random = new Random();
        do {
            code = String.format("%04d", random.nextInt(10000));
        } while (orderMapper.countPickupCode(order.getStoreId(), code) > 0);

        order.setPickupCode(code);
        order.setStatus(OrderStatus.READY.getCode());
        orderMapper.updateById(order);
        return code;
    }

    private OrderVO toVO(Order order) {
        OrderVO vo = new OrderVO();
        vo.setId(order.getId());
        vo.setOrderNo(order.getOrderNo());
        vo.setStatus(order.getStatus());
        vo.setStatusText(getStatusText(order.getStatus()));
        vo.setTotalAmount(order.getTotalAmount());
        vo.setDiscountAmount(order.getDiscountAmount());
        vo.setPayAmount(order.getPayAmount());
        vo.setPayType(order.getPayType());
        vo.setPickupCode(order.getPickupCode());
        vo.setRemark(order.getRemark());
        vo.setCreateTime(order.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));

        List<OrderItem> items = orderItemMapper.selectList(
                new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, order.getId()));
        vo.setItems(items.stream().map(this::toItemVO).collect(Collectors.toList()));

        // 门店信息
        Store store = storeMapper.selectById(order.getStoreId());
        if (store != null) {
            StoreInfo storeInfo = new StoreInfo();
            storeInfo.setStoreId(store.getId());
            storeInfo.setStoreName(store.getName());
            storeInfo.setStoreAddress(store.getAddress());
            storeInfo.setStorePhone(store.getPhone());
            vo.setStoreInfo(storeInfo);
        }

        return vo;
    }

    private OrderItemVO toItemVO(OrderItem item) {
        OrderItemVO vo = new OrderItemVO();
        vo.setId(item.getId());
        vo.setProductId(item.getProductId());
        vo.setProductName(item.getProductName());
        vo.setProductImage(item.getProductImage());
        vo.setSize(item.getSize());
        vo.setTemp(item.getTemp());
        vo.setSugar(item.getSugar());
        vo.setPrice(item.getPrice());
        vo.setQuantity(item.getQuantity());
        vo.setSubtotal(item.getSubtotal());
        return vo;
    }

    private String generateOrderNo() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String random = String.format("%04d", new Random().nextInt(10000));
        return timestamp + random;
    }

    private String getStatusText(String status) {
        try {
            return OrderStatus.valueOf(status.toUpperCase()).getDesc();
        } catch (IllegalArgumentException e) {
            return status;
        }
    }
}

package com.moyucoffee.module.cart.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.moyucoffee.module.cart.dto.CartAddRequest;
import com.moyucoffee.module.cart.dto.CartTotalVO;
import com.moyucoffee.module.cart.dto.CartVO;
import com.moyucoffee.module.cart.entity.CartItem;
import com.moyucoffee.module.cart.mapper.CartItemMapper;
import com.moyucoffee.module.product.entity.Product;
import com.moyucoffee.module.product.entity.ProductSpec;
import com.moyucoffee.module.product.mapper.ProductMapper;
import com.moyucoffee.module.product.mapper.ProductSpecMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemMapper cartItemMapper;
    private final ProductMapper productMapper;
    private final ProductSpecMapper productSpecMapper;

    public List<CartVO> getCartList(Long userId) {
        List<CartItem> items = cartItemMapper.selectList(
                new LambdaQueryWrapper<CartItem>()
                        .eq(CartItem::getUserId, userId)
                        .orderByDesc(CartItem::getCreateTime)
        );
        return items.stream().map(this::toVO).collect(Collectors.toList());
    }

    public CartTotalVO getCartTotal(Long userId) {
        List<CartVO> items = getCartList(userId);
        BigDecimal total = items.stream()
                .filter(i -> i.getChecked() == 1)
                .map(i -> i.getPrice().multiply(BigDecimal.valueOf(i.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
        int count = items.stream().filter(i -> i.getChecked() == 1).mapToInt(CartVO::getQuantity).sum();

        CartTotalVO vo = new CartTotalVO();
        vo.setItems(items);
        vo.setTotalAmount(total);
        vo.setTotalItems(count);
        return vo;
    }

    public void addToCart(Long userId, CartAddRequest request) {
        Product product = productMapper.selectById(request.getProductId());
        if (product == null || product.getStatus() == 0) {
            throw new RuntimeException("商品不存在或已下架");
        }

        // 计算价格
        BigDecimal priceAdjust = getPriceAdjust(request.getProductId(), request.getSize(), request.getTemp(), request.getSugar());

        // 检查是否已存在相同规格的购物车项
        CartItem existing = cartItemMapper.selectOne(
                new LambdaQueryWrapper<CartItem>()
                        .eq(CartItem::getUserId, userId)
                        .eq(CartItem::getProductId, request.getProductId())
                        .eq(CartItem::getSize, request.getSize())
                        .eq(CartItem::getTemp, request.getTemp())
                        .eq(CartItem::getSugar, request.getSugar())
        );

        if (existing != null) {
            existing.setQuantity(existing.getQuantity() + request.getQuantity());
            cartItemMapper.updateById(existing);
        } else {
            CartItem item = new CartItem();
            item.setUserId(userId);
            item.setProductId(request.getProductId());
            item.setQuantity(request.getQuantity());
            item.setSize(request.getSize());
            item.setTemp(request.getTemp());
            item.setSugar(request.getSugar());
            item.setChecked(1);
            cartItemMapper.insert(item);
        }
    }

    public void updateQuantity(Long userId, Long cartItemId, Integer quantity) {
        CartItem item = cartItemMapper.selectById(cartItemId);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new RuntimeException("购物车项不存在");
        }
        item.setQuantity(quantity);
        cartItemMapper.updateById(item);
    }

    public void toggleCheck(Long userId, Long cartItemId) {
        CartItem item = cartItemMapper.selectById(cartItemId);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new RuntimeException("购物车项不存在");
        }
        item.setChecked(item.getChecked() == 1 ? 0 : 1);
        cartItemMapper.updateById(item);
    }

    public void removeItem(Long userId, Long cartItemId) {
        CartItem item = cartItemMapper.selectById(cartItemId);
        if (item == null || !item.getUserId().equals(userId)) {
            throw new RuntimeException("购物车项不存在");
        }
        cartItemMapper.deleteById(cartItemId);
    }

    public void clearChecked(Long userId) {
        cartItemMapper.deleteCheckedByUserId(userId);
    }

    private BigDecimal getPriceAdjust(Long productId, String size, String temp, String sugar) {
        BigDecimal adjust = BigDecimal.ZERO;
        // 只计算SIZE的差价(其他规格暂不计价)
        ProductSpec sizeSpec = productSpecMapper.selectOne(
                new LambdaQueryWrapper<ProductSpec>()
                        .eq(ProductSpec::getProductId, productId)
                        .eq(ProductSpec::getSpecType, "SIZE")
                        .eq(ProductSpec::getSpecValue, size)
        );
        if (sizeSpec != null) {
            adjust = adjust.add(sizeSpec.getPriceAdjust());
        }
        return adjust;
    }

    private CartVO toVO(CartItem item) {
        Product product = productMapper.selectById(item.getProductId());
        BigDecimal priceAdjust = getPriceAdjust(item.getProductId(), item.getSize(), item.getTemp(), item.getSugar());
        BigDecimal price = product != null ? product.getBasePrice().add(priceAdjust) : BigDecimal.ZERO;

        CartVO vo = new CartVO();
        vo.setId(item.getId());
        vo.setProductId(item.getProductId());
        vo.setProductName(product != null ? product.getName() : "");
        vo.setProductImage(product != null ? product.getImageUrl() : "");
        vo.setQuantity(item.getQuantity());
        vo.setSize(item.getSize());
        vo.setTemp(item.getTemp());
        vo.setSugar(item.getSugar());
        vo.setPrice(price);
        vo.setChecked(item.getChecked());
        return vo;
    }
}

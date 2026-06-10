package com.moyucoffee.module.admin;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moyucoffee.module.order.entity.Order;
import com.moyucoffee.module.order.entity.OrderItem;
import com.moyucoffee.module.order.mapper.OrderItemMapper;
import com.moyucoffee.module.order.mapper.OrderMapper;
import com.moyucoffee.module.product.entity.Category;
import com.moyucoffee.module.product.entity.Product;
import com.moyucoffee.module.product.entity.ProductSpec;
import com.moyucoffee.module.product.entity.SpecGroup;
import com.moyucoffee.module.product.entity.SpecOption;
import com.moyucoffee.module.product.mapper.CategoryMapper;
import com.moyucoffee.module.product.mapper.ProductMapper;
import com.moyucoffee.module.product.mapper.ProductSpecMapper;
import com.moyucoffee.module.product.mapper.SpecGroupMapper;
import com.moyucoffee.module.product.mapper.SpecOptionMapper;
import com.moyucoffee.module.user.entity.User;
import com.moyucoffee.module.user.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final ProductMapper productMapper;
    private final CategoryMapper categoryMapper;
    private final OrderMapper orderMapper;
    private final OrderItemMapper orderItemMapper;
    private final UserMapper userMapper;
    private final ProductSpecMapper productSpecMapper;
    private final SpecGroupMapper specGroupMapper;
    private final SpecOptionMapper specOptionMapper;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private List<String> parseImages(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        if (raw.startsWith("[")) {
            try { return objectMapper.readValue(raw, new TypeReference<List<String>>() {}); }
            catch (Exception e) { return Collections.singletonList(raw); }
        }
        return Collections.singletonList(raw);
    }

    // ==================== Category CRUD ====================

    public List<Category> getCategories() {
        return categoryMapper.selectList(
                new LambdaQueryWrapper<Category>().orderByAsc(Category::getSortOrder));
    }

    public Category addCategory(Map<String, Object> body) {
        Category c = new Category();
        c.setName((String) body.get("name"));
        c.setCode((String) body.get("code"));
        c.setSortOrder(body.get("sortOrder") != null ? Integer.valueOf(body.get("sortOrder").toString()) : 0);
        c.setStatus(1);
        categoryMapper.insert(c);
        return c;
    }

    public void updateCategory(Long id, Map<String, Object> body) {
        Category c = categoryMapper.selectById(id);
        if (c == null) return;
        if (body.containsKey("name")) c.setName((String) body.get("name"));
        if (body.containsKey("code")) c.setCode((String) body.get("code"));
        if (body.containsKey("sortOrder")) c.setSortOrder(Integer.valueOf(body.get("sortOrder").toString()));
        if (body.containsKey("status")) c.setStatus(Integer.valueOf(body.get("status").toString()));
        categoryMapper.updateById(c);
    }

    public void deleteCategory(Long id) {
        Category c = categoryMapper.selectById(id);
        if (c != null) { c.setStatus(0); categoryMapper.updateById(c); }
    }

    // ==================== Spec Group CRUD ====================

    public List<Map<String, Object>> getSpecGroups() {
        List<SpecGroup> groups = specGroupMapper.selectList(
                new LambdaQueryWrapper<SpecGroup>().eq(SpecGroup::getStatus, 1).orderByAsc(SpecGroup::getSortOrder));
        List<Map<String, Object>> result = new ArrayList<>();
        for (SpecGroup g : groups) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", g.getId()); m.put("name", g.getName());
            m.put("selectionType", g.getSelectionType()); m.put("sortOrder", g.getSortOrder());
            List<SpecOption> options = specOptionMapper.selectList(
                    new LambdaQueryWrapper<SpecOption>().eq(SpecOption::getGroupId, g.getId()).orderByAsc(SpecOption::getSortOrder));
            List<Map<String, Object>> opts = new ArrayList<>();
            for (SpecOption o : options) {
                Map<String, Object> om = new LinkedHashMap<>();
                om.put("id", o.getId()); om.put("value", o.getValue());
                om.put("priceAdjust", o.getPriceAdjust()); om.put("sortOrder", o.getSortOrder());
                opts.add(om);
            }
            m.put("options", opts);
            result.add(m);
        }
        return result;
    }

    public Map<String, Object> addSpecGroup(Map<String, Object> body) {
        SpecGroup g = new SpecGroup();
        g.setName((String) body.get("name"));
        g.setSelectionType((String) body.getOrDefault("selectionType", "SINGLE"));
        g.setSortOrder(body.get("sortOrder") != null ? Integer.valueOf(body.get("sortOrder").toString()) : 0);
        g.setStatus(1);
        specGroupMapper.insert(g);
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", g.getId()); m.put("name", g.getName()); m.put("selectionType", g.getSelectionType());
        m.put("sortOrder", g.getSortOrder()); m.put("options", Collections.emptyList());
        return m;
    }

    public void updateSpecGroup(Long id, Map<String, Object> body) {
        SpecGroup g = specGroupMapper.selectById(id);
        if (g == null) return;
        if (body.containsKey("name")) g.setName((String) body.get("name"));
        if (body.containsKey("selectionType")) g.setSelectionType((String) body.get("selectionType"));
        if (body.containsKey("sortOrder")) g.setSortOrder(Integer.valueOf(body.get("sortOrder").toString()));
        specGroupMapper.updateById(g);
    }

    public void deleteSpecGroup(Long id) {
        SpecGroup g = specGroupMapper.selectById(id);
        if (g != null) { g.setStatus(0); specGroupMapper.updateById(g); }
    }

    public Map<String, Object> addSpecOption(Long groupId, Map<String, Object> body) {
        SpecOption o = new SpecOption();
        o.setGroupId(groupId);
        o.setValue((String) body.get("value"));
        Object pa = body.get("priceAdjust");
        o.setPriceAdjust(pa != null ? new BigDecimal(pa.toString()) : BigDecimal.ZERO);
        o.setSortOrder(body.get("sortOrder") != null ? Integer.valueOf(body.get("sortOrder").toString()) : 0);
        specOptionMapper.insert(o);
        Map<String, Object> om = new LinkedHashMap<>();
        om.put("id", o.getId()); om.put("groupId", o.getGroupId()); om.put("value", o.getValue());
        om.put("priceAdjust", o.getPriceAdjust()); om.put("sortOrder", o.getSortOrder());
        return om;
    }

    public void updateSpecOption(Long id, Map<String, Object> body) {
        SpecOption o = specOptionMapper.selectById(id);
        if (o == null) return;
        if (body.containsKey("value")) o.setValue((String) body.get("value"));
        if (body.containsKey("priceAdjust")) o.setPriceAdjust(new BigDecimal(body.get("priceAdjust").toString()));
        if (body.containsKey("sortOrder")) o.setSortOrder(Integer.valueOf(body.get("sortOrder").toString()));
        specOptionMapper.updateById(o);
    }

    public void deleteSpecOption(Long id) {
        specOptionMapper.deleteById(id);
    }

    // ==================== Product Specs ====================

    private List<Map<String, Object>> getProductSpecs(Long productId) {
        List<ProductSpec> specs = productSpecMapper.selectList(
                new LambdaQueryWrapper<ProductSpec>().eq(ProductSpec::getProductId, productId).orderByAsc(ProductSpec::getSpecType, ProductSpec::getSortOrder));
        List<Map<String, Object>> list = new ArrayList<>();
        for (ProductSpec s : specs) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("specType", s.getSpecType()); m.put("specValue", s.getSpecValue());
            m.put("priceAdjust", s.getPriceAdjust());
            list.add(m);
        }
        return list;
    }

    private void saveProductSpecs(Long productId, List<Map<String, Object>> specs) {
        productSpecMapper.delete(new LambdaQueryWrapper<ProductSpec>().eq(ProductSpec::getProductId, productId));
        if (specs == null || specs.isEmpty()) return;
        int sort = 0;
        for (Map<String, Object> s : specs) {
            ProductSpec ps = new ProductSpec();
            ps.setProductId(productId);
            ps.setSpecType((String) s.get("specType"));
            ps.setSpecValue((String) s.get("specValue"));
            Object pa = s.get("priceAdjust");
            ps.setPriceAdjust(pa != null ? new BigDecimal(pa.toString()) : BigDecimal.ZERO);
            ps.setSortOrder(sort++);
            productSpecMapper.insert(ps);
        }
    }

    public Map<String, Object> getStats() {
        Map<String, Object> stats = new LinkedHashMap<>();
        stats.put("productCount", productMapper.selectCount(new LambdaQueryWrapper<Product>().eq(Product::getStatus, 1)));
        stats.put("userCount", userMapper.selectCount(null));
        stats.put("todayOrders", orderMapper.selectCount(
                new LambdaQueryWrapper<Order>().ge(Order::getCreateTime, LocalDate.now().atStartOfDay())));
        stats.put("monthRevenue", 0);
        return stats;
    }

    public Page<Map<String, Object>> getProducts(int page, int size) {
        Page<Product> pg = new Page<>(page, size);
        productMapper.selectPage(pg, new LambdaQueryWrapper<Product>().orderByDesc(Product::getCreateTime));
        List<Map<String, Object>> list = new ArrayList<>();
        for (Product p : pg.getRecords()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", p.getId()); m.put("name", p.getName()); m.put("description", p.getDescription());
            m.put("imageUrl", p.getImageUrl()); m.put("basePrice", p.getBasePrice());
            m.put("images", parseImages(p.getImageUrl()));
            m.put("categoryId", p.getCategoryId()); m.put("status", p.getStatus());
            m.put("isRecommend", p.getIsRecommend()); m.put("sortOrder", p.getSortOrder());
            Category cat = categoryMapper.selectById(p.getCategoryId());
            m.put("categoryName", cat != null ? cat.getName() : "");
            m.put("specs", getProductSpecs(p.getId()));
            list.add(m);
        }
        Page<Map<String, Object>> result = new Page<>(page, size, pg.getTotal());
        result.setRecords(list);
        return result;
    }

    public void addProduct(Map<String, Object> body) {
        Product p = new Product();
        p.setName((String) body.get("name"));
        p.setDescription((String) body.get("description"));
        Object rawImages = body.get("images");
        if (rawImages instanceof List) {
            try { p.setImageUrl(objectMapper.writeValueAsString(rawImages)); }
            catch (Exception e) { p.setImageUrl((String) body.get("imageUrl")); }
        } else if (body.containsKey("imageUrl")) {
            p.setImageUrl((String) body.get("imageUrl"));
        }
        p.setBasePrice(new BigDecimal(body.get("basePrice").toString()));
        p.setCategoryId(body.get("categoryId") != null ? Long.valueOf(body.get("categoryId").toString()) : 1L);
        p.setStatus(1);
        p.setSortOrder(0);
        productMapper.insert(p);

        Object specsObj = body.get("specs");
        if (specsObj instanceof List) {
            @SuppressWarnings("unchecked")
            List<Map<String, Object>> specs = (List<Map<String, Object>>) specsObj;
            saveProductSpecs(p.getId(), specs);
        }
    }

    public void updateProduct(Long id, Map<String, Object> body) {
        Product p = productMapper.selectById(id);
        if (p == null) return;
        if (body.containsKey("name")) p.setName((String) body.get("name"));
        if (body.containsKey("description")) p.setDescription((String) body.get("description"));
        if (body.containsKey("imageUrl")) {
            Object rawImages = body.get("images");
            if (rawImages instanceof List) {
                try { p.setImageUrl(objectMapper.writeValueAsString(rawImages)); }
                catch (Exception e) { p.setImageUrl((String) body.get("imageUrl")); }
            } else {
                p.setImageUrl((String) body.get("imageUrl"));
            }
        }
        if (body.containsKey("basePrice")) p.setBasePrice(new BigDecimal(body.get("basePrice").toString()));
        if (body.containsKey("categoryId")) p.setCategoryId(Long.valueOf(body.get("categoryId").toString()));
        if (body.containsKey("status")) p.setStatus(Integer.valueOf(body.get("status").toString()));
        if (body.containsKey("sortOrder")) p.setSortOrder(Integer.valueOf(body.get("sortOrder").toString()));
        productMapper.updateById(p);

        if (body.containsKey("specs")) {
            Object specsObj = body.get("specs");
            if (specsObj instanceof List) {
                @SuppressWarnings("unchecked")
                List<Map<String, Object>> specs = (List<Map<String, Object>>) specsObj;
                saveProductSpecs(p.getId(), specs);
            }
        }
    }

    public void deleteProduct(Long id) {
        Product p = productMapper.selectById(id);
        if (p != null) { p.setStatus(0); productMapper.updateById(p); }
    }

    public Page<Map<String, Object>> getOrders(int page, int size, String status) {
        LambdaQueryWrapper<Order> w = new LambdaQueryWrapper<Order>().orderByDesc(Order::getCreateTime);
        if (!"all".equals(status)) w.eq(Order::getStatus, status);
        Page<Order> pg = new Page<>(page, size);
        orderMapper.selectPage(pg, w);
        List<Map<String, Object>> list = new ArrayList<>();
        for (Order o : pg.getRecords()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", o.getId()); m.put("orderNo", o.getOrderNo()); m.put("status", o.getStatus());
            m.put("totalAmount", o.getTotalAmount()); m.put("payAmount", o.getPayAmount());
            m.put("payType", o.getPayType()); m.put("pickupCode", o.getPickupCode());
            m.put("createTime", o.getCreateTime() != null ? o.getCreateTime().toString() : "");
            List<OrderItem> items = orderItemMapper.selectList(new LambdaQueryWrapper<OrderItem>().eq(OrderItem::getOrderId, o.getId()));
            List<Map<String, Object>> itemList = new ArrayList<>();
            for (OrderItem i : items) {
                Map<String, Object> im = new LinkedHashMap<>();
                im.put("productName", i.getProductName()); im.put("quantity", i.getQuantity()); im.put("price", i.getPrice());
                itemList.add(im);
            }
            m.put("items", itemList);
            list.add(m);
        }
        Page<Map<String, Object>> result = new Page<>(page, size, pg.getTotal());
        result.setRecords(list);
        return result;
    }

    public void updateOrderStatus(Long id, String status) {
        Order o = orderMapper.selectById(id);
        if (o != null) {
            if ("preparing".equals(status)) o.setPickupCode(String.format("%04d", new Random().nextInt(10000)));
            o.setStatus(status);
            orderMapper.updateById(o);
        }
    }

    public Page<Map<String, Object>> getUsers(int page, int size, String keyword) {
        LambdaQueryWrapper<User> w = new LambdaQueryWrapper<User>().orderByDesc(User::getCreateTime);
        if (keyword != null && !keyword.isBlank()) w.like(User::getPhone, keyword);
        Page<User> pg = new Page<>(page, size);
        userMapper.selectPage(pg, w);
        List<Map<String, Object>> list = new ArrayList<>();
        for (User u : pg.getRecords()) {
            Map<String, Object> m = new LinkedHashMap<>();
            m.put("id", u.getId()); m.put("nickname", u.getNickname()); m.put("avatarUrl", u.getAvatarUrl());
            m.put("phone", u.getPhone()); m.put("registerTime", u.getRegisterTime() != null ? u.getRegisterTime().toString() : "");
            list.add(m);
        }
        Page<Map<String, Object>> result = new Page<>(page, size, pg.getTotal());
        result.setRecords(list);
        return result;
    }
}

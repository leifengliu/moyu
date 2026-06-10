package com.moyucoffee.module.product.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.moyucoffee.module.product.dto.CategoryVO;
import com.moyucoffee.module.product.dto.ProductVO;
import com.moyucoffee.module.product.dto.SpecGroup;
import com.moyucoffee.module.product.dto.SpecOption;
import com.moyucoffee.module.product.entity.Category;
import com.moyucoffee.module.product.entity.Product;
import com.moyucoffee.module.product.entity.ProductSpec;
import com.moyucoffee.module.product.mapper.CategoryMapper;
import com.moyucoffee.module.product.mapper.ProductMapper;
import com.moyucoffee.module.product.mapper.ProductSpecMapper;
import com.moyucoffee.module.product.mapper.SpecGroupMapper;
import com.moyucoffee.module.product.mapper.BannerMapper;
import com.moyucoffee.module.product.mapper.HomePickMapper;
import com.moyucoffee.module.product.entity.Banner;
import com.moyucoffee.module.product.entity.HomePick;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    private final ProductSpecMapper productSpecMapper;
    private final SpecGroupMapper specGroupMapper;
    private final BannerMapper bannerMapper;
    private final HomePickMapper homePickMapper;
    private static final ObjectMapper objectMapper = new ObjectMapper();

    private List<String> parseImages(String raw) {
        if (raw == null || raw.isBlank()) return Collections.emptyList();
        if (raw.startsWith("[")) {
            try {
                return objectMapper.readValue(raw, new TypeReference<List<String>>() {});
            } catch (Exception e) {
                return Collections.singletonList(raw);
            }
        }
        return Collections.singletonList(raw);
    }

    public List<CategoryVO> getCategories() {
        return categoryMapper.selectList(
                new LambdaQueryWrapper<Category>().eq(Category::getStatus, 1).orderByAsc(Category::getSortOrder)
        ).stream().map(c -> {
            CategoryVO vo = new CategoryVO();
            vo.setId(c.getId());
            vo.setName(c.getName());
            vo.setCode(c.getCode());
            vo.setSortOrder(c.getSortOrder());
            vo.setIcon(c.getIcon());
            return vo;
        }).collect(Collectors.toList());
    }

    public Page<ProductVO> getProductList(Integer page, Integer size, Long categoryId, String keyword) {
        Page<Product> pageParam = new Page<>(page, size);
        LambdaQueryWrapper<Product> wrapper = new LambdaQueryWrapper<Product>()
                .eq(Product::getStatus, 1)
                .orderByAsc(Product::getSortOrder);

        if (categoryId != null) {
            wrapper.eq(Product::getCategoryId, categoryId);
        }
        if (keyword != null && !keyword.isBlank()) {
            wrapper.like(Product::getName, keyword);
        }

        Page<Product> result = productMapper.selectPage(pageParam, wrapper);
        List<ProductVO> vos = result.getRecords().stream().map(this::toVO).collect(Collectors.toList());

        Page<ProductVO> voPage = new Page<>(page, size, result.getTotal());
        voPage.setRecords(vos);
        return voPage;
    }

    public List<ProductVO> getRecommendProducts() {
        List<Product> products = productMapper.selectList(
                new LambdaQueryWrapper<Product>()
                        .eq(Product::getStatus, 1)
                        .eq(Product::getIsRecommend, 1)
                        .orderByDesc(Product::getSalesCount)
                        .last("LIMIT 10")
        );
        return products.stream().map(this::toVO).collect(Collectors.toList());
    }

    public ProductVO getProductDetail(Long id) {
        Product product = productMapper.selectById(id);
        if (product == null || product.getStatus() == 0) {
            throw new RuntimeException("商品不存在或已下架");
        }
        ProductVO vo = toVO(product);
        vo.setDescription(product.getDescription());
        vo.setIsRecommend(product.getIsRecommend());
        vo.setIsNew(product.getIsNew());
        vo.setSalesCount(product.getSalesCount());
        return vo;
    }

    public List<ProductVO> searchProducts(String keyword) {
        List<Product> products = productMapper.selectList(
                new LambdaQueryWrapper<Product>()
                        .eq(Product::getStatus, 1)
                        .like(Product::getName, keyword)
                        .orderByDesc(Product::getSalesCount)
                        .last("LIMIT 20")
        );
        return products.stream().map(this::toVO).collect(Collectors.toList());
    }

    private ProductVO toVO(Product product) {
        ProductVO vo = new ProductVO();
        vo.setId(product.getId());
        vo.setCategoryId(product.getCategoryId());
        vo.setName(product.getName());
        vo.setDescription(product.getDescription());
        List<String> images = parseImages(product.getImageUrl());
        vo.setImages(images);
        vo.setImageUrl(images.isEmpty() ? null : images.get(0));
        vo.setBasePrice(product.getBasePrice());
        vo.setIsRecommend(product.getIsRecommend());
        vo.setIsNew(product.getIsNew());
        vo.setSalesCount(product.getSalesCount());

        // 加载规格 - 动态从模板获取规格组名和选择类型
        List<ProductSpec> specs = productSpecMapper.selectList(
                new LambdaQueryWrapper<ProductSpec>()
                        .eq(ProductSpec::getProductId, product.getId())
                        .orderByAsc(ProductSpec::getSpecType, ProductSpec::getSortOrder)
        );

        Map<String, List<ProductSpec>> grouped = specs.stream()
                .collect(Collectors.groupingBy(ProductSpec::getSpecType));

        // 从模板加载所有规格组（用于获取selectionType和排序）
        List<com.moyucoffee.module.product.entity.SpecGroup> groups = specGroupMapper.selectList(
                new LambdaQueryWrapper<com.moyucoffee.module.product.entity.SpecGroup>()
                        .eq(com.moyucoffee.module.product.entity.SpecGroup::getStatus, 1)
                        .orderByAsc(com.moyucoffee.module.product.entity.SpecGroup::getSortOrder));
        Map<String, com.moyucoffee.module.product.entity.SpecGroup> groupMap = groups.stream()
                .collect(Collectors.toMap(com.moyucoffee.module.product.entity.SpecGroup::getName, g -> g, (a, b) -> a));

        List<com.moyucoffee.module.product.dto.SpecGroup> specGroups = new ArrayList<>();
        for (Map.Entry<String, List<ProductSpec>> entry : grouped.entrySet()) {
            String specType = entry.getKey();
            com.moyucoffee.module.product.dto.SpecGroup group = new com.moyucoffee.module.product.dto.SpecGroup();
            group.setSpecType(specType);
            com.moyucoffee.module.product.entity.SpecGroup template = groupMap.get(specType);
            group.setSelectionType(template != null ? template.getSelectionType() : "SINGLE");
            group.setOptions(entry.getValue().stream().map(s -> {
                com.moyucoffee.module.product.dto.SpecOption opt = new com.moyucoffee.module.product.dto.SpecOption();
                opt.setSpecValue(s.getSpecValue());
                opt.setPriceAdjust(s.getPriceAdjust());
                return opt;
            }).collect(Collectors.toList()));
            specGroups.add(group);
        }
        vo.setSpecs(specGroups);
        return vo;
    }

    public List<Banner> getBanners() {
        return bannerMapper.selectList(
                new LambdaQueryWrapper<Banner>().eq(Banner::getStatus, 1).orderByAsc(Banner::getSortOrder));
    }

    public java.util.Map<String, List<ProductVO>> getHomeRecommend() {
        List<HomePick> picks = homePickMapper.selectList(
                new LambdaQueryWrapper<HomePick>().orderByAsc(HomePick::getSortOrder));
        Map<String, List<Long>> pickIds = new java.util.LinkedHashMap<>();
        pickIds.put("drinks", new ArrayList<>());
        pickIds.put("merch", new ArrayList<>());
        for (HomePick p : picks) {
            pickIds.computeIfAbsent(p.getSection(), k -> new ArrayList<>()).add(p.getProductId());
        }
        java.util.Map<String, List<ProductVO>> result = new java.util.LinkedHashMap<>();
        for (String section : java.util.Arrays.asList("drinks", "merch")) {
            List<Long> ids = pickIds.getOrDefault(section, Collections.emptyList());
            List<Product> products = ids.isEmpty() ? Collections.emptyList()
                    : productMapper.selectBatchIds(ids);
            // 保持 sort_order 顺序
            List<Product> ordered = new ArrayList<>();
            for (Long id : ids) {
                products.stream().filter(p -> p.getId().equals(id)).findFirst().ifPresent(ordered::add);
            }
            result.put(section, ordered.stream().map(this::toVO).collect(Collectors.toList()));
        }
        return result;
    }
}

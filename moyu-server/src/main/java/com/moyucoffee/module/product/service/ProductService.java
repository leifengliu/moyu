package com.moyucoffee.module.product.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
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
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final CategoryMapper categoryMapper;
    private final ProductMapper productMapper;
    private final ProductSpecMapper productSpecMapper;

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
        vo.setImageUrl(product.getImageUrl());
        vo.setBasePrice(product.getBasePrice());
        vo.setIsRecommend(product.getIsRecommend());
        vo.setIsNew(product.getIsNew());
        vo.setSalesCount(product.getSalesCount());

        // 加载规格
        List<ProductSpec> specs = productSpecMapper.selectList(
                new LambdaQueryWrapper<ProductSpec>()
                        .eq(ProductSpec::getProductId, product.getId())
                        .orderByAsc(ProductSpec::getSpecType, ProductSpec::getSortOrder)
        );

        Map<String, List<ProductSpec>> grouped = specs.stream()
                .collect(Collectors.groupingBy(ProductSpec::getSpecType));

        List<SpecGroup> specGroups = new ArrayList<>();
        String[] types = {"SIZE", "TEMP", "SUGAR"};
        String[] typeNames = {"规格", "温度", "甜度"};
        for (int i = 0; i < types.length; i++) {
            List<ProductSpec> typeSpecs = grouped.get(types[i]);
            if (typeSpecs != null) {
                SpecGroup group = new SpecGroup();
                group.setSpecType(typeNames[i]);
                group.setOptions(typeSpecs.stream().map(s -> {
                    SpecOption opt = new SpecOption();
                    opt.setSpecValue(s.getSpecValue());
                    opt.setPriceAdjust(s.getPriceAdjust());
                    return opt;
                }).collect(Collectors.toList()));
                specGroups.add(group);
            }
        }
        vo.setSpecs(specGroups);
        return vo;
    }
}

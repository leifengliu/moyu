package com.moyucoffee.module.points.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.moyucoffee.common.exception.BusinessException;
import com.moyucoffee.module.points.dto.PointsInfoVO;
import com.moyucoffee.module.points.dto.PointsProductVO;
import com.moyucoffee.module.points.dto.PointsRecordVO;
import com.moyucoffee.module.points.entity.PointsAccount;
import com.moyucoffee.module.points.entity.PointsProduct;
import com.moyucoffee.module.points.entity.PointsRecord;
import com.moyucoffee.module.points.mapper.PointsAccountMapper;
import com.moyucoffee.module.points.mapper.PointsProductMapper;
import com.moyucoffee.module.points.mapper.PointsRecordMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PointsService {

    private final PointsAccountMapper pointsAccountMapper;
    private final PointsRecordMapper pointsRecordMapper;
    private final PointsProductMapper pointsProductMapper;

    public PointsInfoVO getPointsInfo(Long userId) {
        PointsAccount account = getOrCreateAccount(userId);
        PointsInfoVO vo = new PointsInfoVO();
        vo.setBalance(account.getBalance());
        vo.setTotalEarned(account.getTotalEarned());
        return vo;
    }

    public Page<PointsRecordVO> getRecords(Long userId, Integer page, Integer size) {
        Page<PointsRecord> pageParam = new Page<>(page, size);
        Page<PointsRecord> result = pointsRecordMapper.selectPage(pageParam,
                new LambdaQueryWrapper<PointsRecord>()
                        .eq(PointsRecord::getUserId, userId)
                        .orderByDesc(PointsRecord::getCreateTime));

        List<PointsRecordVO> vos = result.getRecords().stream().map(r -> {
            PointsRecordVO vo = new PointsRecordVO();
            vo.setId(r.getId());
            vo.setType(r.getType());
            vo.setPoints(r.getPoints());
            vo.setBalanceAfter(r.getBalanceAfter());
            vo.setDescription(r.getDescription());
            vo.setCreateTime(r.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            return vo;
        }).collect(Collectors.toList());

        Page<PointsRecordVO> voPage = new Page<>(page, size, result.getTotal());
        voPage.setRecords(vos);
        return voPage;
    }

    public List<PointsProductVO> getProducts() {
        return pointsProductMapper.selectList(
                new LambdaQueryWrapper<PointsProduct>().eq(PointsProduct::getStatus, 1)
        ).stream().map(p -> {
            PointsProductVO vo = new PointsProductVO();
            vo.setId(p.getId());
            vo.setName(p.getName());
            vo.setImageUrl(p.getImageUrl());
            vo.setPoints(p.getPoints());
            vo.setStock(p.getStock());
            return vo;
        }).collect(Collectors.toList());
    }

    @Transactional
    public void redeem(Long userId, Long productId) {
        PointsProduct product = pointsProductMapper.selectById(productId);
        if (product == null || product.getStatus() == 0) {
            throw new BusinessException("兑换商品不存在");
        }
        if (product.getStock() <= 0) {
            throw new BusinessException(400, "库存不足");
        }

        PointsAccount account = getOrCreateAccount(userId);
        if (account.getBalance() < product.getPoints()) {
            throw new BusinessException(400, "积分不足");
        }

        // 扣减积分
        pointsAccountMapper.deductPoints(userId, product.getPoints());
        // 扣减库存
        pointsProductMapper.deductStock(productId);

        // 重新查询
        account = pointsAccountMapper.selectByUserId(userId);
        record(userId, "REDEEM", -product.getPoints(), account.getBalance(),
                "兑换 " + product.getName());
    }

    @Transactional
    public void addPoints(Long userId, int points, String type, Long orderId, String desc) {
        pointsAccountMapper.addPoints(userId, points);
        PointsAccount account = pointsAccountMapper.selectByUserId(userId);
        record(userId, type, points, account.getBalance(), desc);
    }

    private PointsAccount getOrCreateAccount(Long userId) {
        PointsAccount account = pointsAccountMapper.selectByUserId(userId);
        if (account == null) {
            account = new PointsAccount();
            account.setUserId(userId);
            account.setBalance(0);
            account.setTotalEarned(0);
            pointsAccountMapper.insert(account);
        }
        return account;
    }

    private void record(Long userId, String type, int points, int balanceAfter, String desc) {
        PointsRecord record = new PointsRecord();
        record.setUserId(userId);
        record.setType(type);
        record.setPoints(points);
        record.setBalanceAfter(balanceAfter);
        record.setDescription(desc);
        pointsRecordMapper.insert(record);
    }
}

package com.moyucoffee.module.wallet.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.baomidou.mybatisplus.core.metadata.IPage;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.moyucoffee.common.constant.PayType;
import com.moyucoffee.common.exception.BusinessException;
import com.moyucoffee.module.wallet.dto.RechargePackageVO;
import com.moyucoffee.module.wallet.dto.TransactionVO;
import com.moyucoffee.module.wallet.dto.WalletVO;
import com.moyucoffee.module.wallet.entity.RechargePackage;
import com.moyucoffee.module.wallet.entity.WalletAccount;
import com.moyucoffee.module.wallet.entity.WalletTransaction;
import com.moyucoffee.module.wallet.mapper.RechargePackageMapper;
import com.moyucoffee.module.wallet.mapper.WalletAccountMapper;
import com.moyucoffee.module.wallet.mapper.WalletTransactionMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class WalletService {

    private final WalletAccountMapper walletAccountMapper;
    private final WalletTransactionMapper transactionMapper;
    private final RechargePackageMapper packageMapper;

    public WalletVO getWalletInfo(Long userId) {
        WalletAccount account = getOrCreateAccount(userId);
        WalletVO vo = new WalletVO();
        vo.setBalance(account.getBalance());
        vo.setTotalRecharge(account.getTotalRecharge());
        return vo;
    }

    public List<RechargePackageVO> getPackages() {
        return packageMapper.selectList(
                new LambdaQueryWrapper<RechargePackage>()
                        .eq(RechargePackage::getStatus, 1)
                        .orderByAsc(RechargePackage::getSortOrder)
        ).stream().map(p -> {
            RechargePackageVO vo = new RechargePackageVO();
            vo.setId(p.getId());
            vo.setAmount(p.getAmount());
            vo.setBonus(p.getBonus());
            vo.setIsRecommend(p.getIsRecommend());
            return vo;
        }).collect(Collectors.toList());
    }

    public IPage<TransactionVO> getTransactions(Long userId, Integer page, Integer size) {
        Page<WalletTransaction> pageParam = new Page<>(page, size);
        Page<WalletTransaction> result = transactionMapper.selectPage(pageParam,
                new LambdaQueryWrapper<WalletTransaction>()
                        .eq(WalletTransaction::getUserId, userId)
                        .orderByDesc(WalletTransaction::getCreateTime));

        List<TransactionVO> vos = result.getRecords().stream().map(t -> {
            TransactionVO vo = new TransactionVO();
            vo.setId(t.getId());
            vo.setType(t.getType());
            vo.setAmount(t.getAmount());
            vo.setBalanceAfter(t.getBalanceAfter());
            vo.setDescription(t.getDescription());
            vo.setCreateTime(t.getCreateTime().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
            return vo;
        }).collect(Collectors.toList());

        Page<TransactionVO> voPage = new Page<>(page, size, result.getTotal());
        voPage.setRecords(vos);
        return voPage;
    }

    @Transactional
    public void recharge(Long userId, Long packageId) {
        RechargePackage pkg = packageMapper.selectById(packageId);
        if (pkg == null || pkg.getStatus() == 0) {
            throw new BusinessException("套餐不存在");
        }

        WalletAccount account = getOrCreateAccount(userId);
        BigDecimal totalAmount = pkg.getAmount().add(pkg.getBonus());

        // 更新余额
        int updated = walletAccountMapper.addBalance(userId, totalAmount);
        if (updated == 0) {
            throw new BusinessException("充值失败");
        }

        // 重新查询最新余额
        account = walletAccountMapper.selectByUserId(userId);
        recordTransaction(userId, "RECHARGE", totalAmount, account.getBalance(),
                null, "储值套餐 ¥" + pkg.getAmount() + " 送 ¥" + pkg.getBonus());

        log.info("用户 {} 充值成功: 金额 {} 赠送 {} 余额 {}", userId, pkg.getAmount(), pkg.getBonus(), account.getBalance());
    }

    @Transactional
    public void deduct(Long userId, BigDecimal amount, Long orderId, String desc) {
        WalletAccount account = walletAccountMapper.selectByUserId(userId);
        if (account == null || account.getBalance().compareTo(amount) < 0) {
            throw new BusinessException(400, "储值余额不足");
        }

        int updated = walletAccountMapper.deductBalance(userId, amount);
        if (updated == 0) {
            throw new BusinessException(400, "储值余额不足");
        }

        account = walletAccountMapper.selectByUserId(userId);
        recordTransaction(userId, "CONSUME", amount.negate(), account.getBalance(), orderId, desc);
    }

    @Transactional
    public void refund(Long userId, BigDecimal amount, Long orderId, String desc) {
        walletAccountMapper.addBalance(userId, amount);
        WalletAccount account = walletAccountMapper.selectByUserId(userId);
        recordTransaction(userId, "REFUND", amount, account.getBalance(), orderId, desc);
    }

    private WalletAccount getOrCreateAccount(Long userId) {
        WalletAccount account = walletAccountMapper.selectByUserId(userId);
        if (account == null) {
            account = new WalletAccount();
            account.setUserId(userId);
            account.setBalance(BigDecimal.ZERO);
            account.setTotalRecharge(BigDecimal.ZERO);
            walletAccountMapper.insert(account);
        }
        return account;
    }

    private void recordTransaction(Long userId, String type, BigDecimal amount,
                                    BigDecimal balanceAfter, Long orderId, String desc) {
        WalletTransaction t = new WalletTransaction();
        t.setUserId(userId);
        t.setType(type);
        t.setAmount(amount);
        t.setBalanceAfter(balanceAfter);
        t.setOrderId(orderId);
        t.setDescription(desc);
        transactionMapper.insert(t);
    }
}

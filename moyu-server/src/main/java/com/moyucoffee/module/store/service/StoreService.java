package com.moyucoffee.module.store.service;

import com.baomidou.mybatisplus.core.conditions.query.LambdaQueryWrapper;
import com.moyucoffee.module.store.entity.Store;
import com.moyucoffee.module.store.mapper.StoreMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class StoreService {

    private final StoreMapper storeMapper;

    public Store getStore(Long id) {
        return storeMapper.selectById(id);
    }

    public List<Store> getStoreList() {
        return storeMapper.selectList(
                new LambdaQueryWrapper<Store>().eq(Store::getStatus, 1));
    }
}

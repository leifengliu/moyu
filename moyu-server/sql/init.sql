-- =============================================
-- 摸鱼咖啡 (Moyu Coffee) 数据库初始化脚本
-- 包含建表语句 + 种子数据
-- 连接信息: localhost:3306, root/123456
-- =============================================

CREATE DATABASE IF NOT EXISTS `moyu_coffee` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE `moyu_coffee`;

-- =============================================
-- 1. 用户与认证
-- =============================================
CREATE TABLE `sys_user` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `openid` VARCHAR(64) NOT NULL COMMENT '微信OpenID',
  `unionid` VARCHAR(64) COMMENT '微信UnionID',
  `nickname` VARCHAR(64) COMMENT '昵称',
  `avatar_url` VARCHAR(512) COMMENT '头像URL',
  `phone` VARCHAR(20) COMMENT '手机号',
  `birthday` VARCHAR(16) COMMENT '生日 yyyy-MM-dd',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1正常 0禁用',
  `last_login_time` DATETIME COMMENT '最后登录时间',
  `register_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_openid` (`openid`),
  UNIQUE KEY `uk_phone` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- =============================================
-- 2. 商品模块
-- =============================================
CREATE TABLE `prd_category` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL COMMENT '分类名',
  `code` VARCHAR(32) NOT NULL COMMENT '分类编码',
  `sort_order` INT DEFAULT 0,
  `icon` VARCHAR(64) COMMENT '图标',
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_code` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品分类表';

CREATE TABLE `prd_product` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `category_id` BIGINT NOT NULL,
  `name` VARCHAR(128) NOT NULL COMMENT '商品名',
  `description` VARCHAR(512) COMMENT '描述',
  `image_url` VARCHAR(512) COMMENT '主图URL',
  `base_price` DECIMAL(10,2) NOT NULL COMMENT '基础价格(中杯/热饮/标准糖)',
  `status` TINYINT DEFAULT 1 COMMENT '状态: 1上架 0下架',
  `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐',
  `is_new` TINYINT DEFAULT 0 COMMENT '是否新品',
  `sales_count` INT DEFAULT 0 COMMENT '销量',
  `sort_order` INT DEFAULT 0,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_category` (`category_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品表';

CREATE TABLE `prd_product_spec` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `product_id` BIGINT NOT NULL,
  `spec_type` VARCHAR(32) NOT NULL COMMENT '规格类型: SIZE/TEMP/SUGAR',
  `spec_value` VARCHAR(32) NOT NULL COMMENT '规格值',
  `price_adjust` DECIMAL(10,2) DEFAULT 0 COMMENT '价格调整(相对base_price)',
  `sort_order` INT DEFAULT 0,
  KEY `idx_product` (`product_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='商品规格表';

-- =============================================
-- 3. 购物车模块
-- =============================================
CREATE TABLE `crt_cart_item` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `quantity` INT NOT NULL DEFAULT 1,
  `size` VARCHAR(32) DEFAULT '中杯',
  `temp` VARCHAR(32) DEFAULT '热饮',
  `sugar` VARCHAR(32) DEFAULT '标准糖',
  `checked` TINYINT DEFAULT 1 COMMENT '是否勾选',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY `idx_user` (`user_id`),
  UNIQUE KEY `uk_user_product_spec` (`user_id`, `product_id`, `size`, `temp`, `sugar`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='购物车表';

-- =============================================
-- 4. 订单模块
-- =============================================
CREATE TABLE `ord_order` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_no` VARCHAR(32) NOT NULL COMMENT '订单号: yyyyMMddHHmmss+4位随机数',
  `user_id` BIGINT NOT NULL,
  `store_id` BIGINT DEFAULT 1 COMMENT '门店ID',
  `status` VARCHAR(32) NOT NULL DEFAULT 'pending' COMMENT 'pending/paid/preparing/ready/completed/cancelled/refunding/refunded',
  `total_amount` DECIMAL(10,2) NOT NULL COMMENT '商品总金额',
  `discount_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '优惠金额',
  `pay_amount` DECIMAL(10,2) NOT NULL COMMENT '实付金额',
  `pay_type` VARCHAR(32) COMMENT '支付方式: WECHAT/WALLET',
  `pay_time` DATETIME COMMENT '支付时间',
  `pickup_code` VARCHAR(8) COMMENT '取餐码(4位数字)',
  `coupon_id` BIGINT COMMENT '使用的优惠券ID(用户优惠券)',
  `remark` VARCHAR(256) COMMENT '备注',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_status` (`status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

CREATE TABLE `ord_order_item` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `product_id` BIGINT NOT NULL,
  `product_name` VARCHAR(128) NOT NULL COMMENT '快照-商品名',
  `product_image` VARCHAR(512) COMMENT '快照-商品图',
  `size` VARCHAR(32),
  `temp` VARCHAR(32),
  `sugar` VARCHAR(32),
  `price` DECIMAL(10,2) NOT NULL COMMENT '下单时单价',
  `quantity` INT NOT NULL,
  `subtotal` DECIMAL(10,2) NOT NULL COMMENT '小计',
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单商品表';

CREATE TABLE `ord_order_log` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `order_id` BIGINT NOT NULL,
  `from_status` VARCHAR(32),
  `to_status` VARCHAR(32) NOT NULL,
  `operator` VARCHAR(64) DEFAULT 'system',
  `remark` VARCHAR(256),
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单状态日志';

-- =============================================
-- 5. 储值模块
-- =============================================
CREATE TABLE `wlt_account` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `balance` DECIMAL(10,2) DEFAULT 0 COMMENT '储值余额(元)',
  `total_recharge` DECIMAL(10,2) DEFAULT 0 COMMENT '累计充值',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='储值账户';

CREATE TABLE `wlt_recharge_package` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `amount` DECIMAL(10,2) NOT NULL COMMENT '充值金额',
  `bonus` DECIMAL(10,2) DEFAULT 0 COMMENT '赠送金额',
  `is_recommend` TINYINT DEFAULT 0 COMMENT '是否推荐',
  `status` TINYINT DEFAULT 1,
  `sort_order` INT DEFAULT 0,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='储值套餐';

CREATE TABLE `wlt_transaction` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `type` VARCHAR(32) NOT NULL COMMENT '类型: RECHARGE/CONSUME/REFUND',
  `amount` DECIMAL(10,2) NOT NULL COMMENT '金额(正=充值 负=消费)',
  `balance_after` DECIMAL(10,2) NOT NULL COMMENT '交易后余额',
  `order_id` BIGINT COMMENT '关联订单ID',
  `description` VARCHAR(256),
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user` (`user_id`),
  KEY `idx_order` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='储值交易记录';

-- =============================================
-- 6. 积分模块
-- =============================================
CREATE TABLE `pts_account` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL UNIQUE,
  `balance` INT DEFAULT 0 COMMENT '积分余额',
  `total_earned` INT DEFAULT 0 COMMENT '累计获得',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分账户';

CREATE TABLE `pts_record` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `user_id` BIGINT NOT NULL,
  `type` VARCHAR(32) NOT NULL COMMENT '类型: SIGN_IN/ORDER/EXCHANGE/REDEEM/REFUND',
  `points` INT NOT NULL COMMENT '积分变动(正=获得 负=消耗)',
  `balance_after` INT NOT NULL,
  `description` VARCHAR(256),
  `order_id` BIGINT COMMENT '关联订单ID',
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  KEY `idx_user` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分记录';

CREATE TABLE `pts_product` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL COMMENT '商品名',
  `image_url` VARCHAR(512) COMMENT '图片URL',
  `points` INT NOT NULL COMMENT '所需积分',
  `stock` INT DEFAULT 0 COMMENT '库存',
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='积分兑换商品';

-- =============================================
-- 7. 优惠券模块
-- =============================================
CREATE TABLE `cpn_coupon` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL COMMENT '券名称',
  `type` VARCHAR(32) NOT NULL COMMENT '类型: DISCOUNT(折扣券)/FIXED(满减券)',
  `discount_value` DECIMAL(10,2) NOT NULL COMMENT '折扣值(折扣率0-10 或 固定金额)',
  `min_amount` DECIMAL(10,2) DEFAULT 0 COMMENT '最低消费金额',
  `total_count` INT DEFAULT 0 COMMENT '发行总量',
  `received_count` INT DEFAULT 0 COMMENT '已领取量',
  `valid_days` INT DEFAULT 30 COMMENT '有效天数',
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='优惠券定义';

CREATE TABLE `cpn_user_coupon` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `coupon_id` BIGINT NOT NULL,
  `user_id` BIGINT NOT NULL,
  `status` VARCHAR(32) DEFAULT 'UNUSED' COMMENT 'UNUSED/USED/EXPIRED',
  `receive_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `use_time` DATETIME,
  `expire_time` DATETIME NOT NULL,
  `order_id` BIGINT COMMENT '使用的订单ID',
  KEY `idx_user` (`user_id`),
  KEY `idx_status` (`user_id`, `status`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户优惠券';

-- =============================================
-- 8. 门店模块
-- =============================================
CREATE TABLE `cfg_store` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(128) NOT NULL COMMENT '店名',
  `address` VARCHAR(256) COMMENT '地址',
  `phone` VARCHAR(20) COMMENT '电话',
  `latitude` DECIMAL(10,7),
  `longitude` DECIMAL(10,7),
  `business_hours` VARCHAR(64) COMMENT '营业时间',
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='门店表';

-- =============================================
-- 9. 种子数据 (样例数据)
-- =============================================

-- -------------------------------------------
-- 商品分类
-- -------------------------------------------
INSERT INTO `prd_category` (`name`, `code`, `sort_order`, `icon`) VALUES
('新品', 'new', 1, 'Sparkles'),
('经典咖啡', 'coffee', 2, 'Coffee'),
('特调', 'special', 3, 'Coffee'),
('周边', 'merch', 4, 'Coffee');

-- -------------------------------------------
-- 商品
-- -------------------------------------------
INSERT INTO `prd_product` (`id`, `category_id`, `name`, `description`, `image_url`, `base_price`, `status`, `is_recommend`, `is_new`, `sales_count`, `sort_order`) VALUES
(1, 2, '拿铁咖啡', '经典浓郁，奶香十足，选用优质咖啡豆搭配香醇牛奶', '/images/latte.jpg', 28.00, 1, 1, 0, 520, 1),
(2, 2, '美式咖啡', '纯粹黑咖啡，提神醒脑，适合追求纯粹咖啡风味的你', '/images/americano.jpg', 22.00, 1, 1, 0, 430, 2),
(3, 2, '冰咖啡', '冰爽清凉，夏日必备，消暑提神两不误', '/images/iced-coffee.jpg', 30.00, 1, 1, 1, 380, 3),
(4, 2, '卡布奇诺', '绵密奶泡，口感丰富，经典意式咖啡的代表之作', '/images/cappuccino.jpg', 26.00, 1, 1, 0, 310, 4),
(5, 3, '摩卡咖啡', '巧克力与咖啡的完美融合，甜蜜与醇厚的双重享受', '/images/mocha.jpg', 32.00, 1, 0, 1, 250, 5),
(6, 3, '抹茶拿铁', '清新抹茶，健康好喝，日式抹茶遇见意式拿铁', '/images/matcha-latte.jpg', 32.00, 1, 0, 1, 200, 6),
(7, 1, '可颂', '现烤可颂，酥脆可口，搭配咖啡绝佳伴侣', '/images/croissant.jpg', 18.00, 1, 0, 1, 180, 7),
(8, 4, '咖啡豆', '精选阿拉比卡咖啡豆，产地直采，家用首选', '/images/beans.jpg', 88.00, 1, 0, 0, 90, 8);

-- -------------------------------------------
-- 商品规格 (SIZE/TEMP/SUGAR)
-- -------------------------------------------
-- 规格说明: 中杯基准价, 小杯-2元, 大杯+4元; 温度/甜度暂无差价
INSERT INTO `prd_product_spec` (`product_id`, `spec_type`, `spec_value`, `price_adjust`, `sort_order`) VALUES
-- 拿铁咖啡 (id=1)
(1, 'SIZE', '小杯', -2.00, 1), (1, 'SIZE', '中杯', 0.00, 2), (1, 'SIZE', '大杯', 4.00, 3),
(1, 'TEMP', '热饮', 0.00, 1), (1, 'TEMP', '少冰', 0.00, 2), (1, 'TEMP', '正常冰', 0.00, 3), (1, 'TEMP', '多冰', 0.00, 4),
(1, 'SUGAR', '无糖', 0.00, 1), (1, 'SUGAR', '三分糖', 0.00, 2), (1, 'SUGAR', '五分糖', 0.00, 3), (1, 'SUGAR', '标准糖', 0.00, 4),
-- 美式咖啡 (id=2)
(2, 'SIZE', '小杯', -2.00, 1), (2, 'SIZE', '中杯', 0.00, 2), (2, 'SIZE', '大杯', 4.00, 3),
(2, 'TEMP', '热饮', 0.00, 1), (2, 'TEMP', '少冰', 0.00, 2), (2, 'TEMP', '正常冰', 0.00, 3), (2, 'TEMP', '多冰', 0.00, 4),
(2, 'SUGAR', '无糖', 0.00, 1), (2, 'SUGAR', '三分糖', 0.00, 2), (2, 'SUGAR', '五分糖', 0.00, 3), (2, 'SUGAR', '标准糖', 0.00, 4),
-- 冰咖啡 (id=3)
(3, 'SIZE', '小杯', -2.00, 1), (3, 'SIZE', '中杯', 0.00, 2), (3, 'SIZE', '大杯', 4.00, 3),
(3, 'TEMP', '热饮', 0.00, 1), (3, 'TEMP', '少冰', 0.00, 2), (3, 'TEMP', '正常冰', 0.00, 3), (3, 'TEMP', '多冰', 0.00, 4),
(3, 'SUGAR', '无糖', 0.00, 1), (3, 'SUGAR', '三分糖', 0.00, 2), (3, 'SUGAR', '五分糖', 0.00, 3), (3, 'SUGAR', '标准糖', 0.00, 4),
-- 卡布奇诺 (id=4)
(4, 'SIZE', '小杯', -2.00, 1), (4, 'SIZE', '中杯', 0.00, 2), (4, 'SIZE', '大杯', 4.00, 3),
(4, 'TEMP', '热饮', 0.00, 1), (4, 'TEMP', '少冰', 0.00, 2), (4, 'TEMP', '正常冰', 0.00, 3), (4, 'TEMP', '多冰', 0.00, 4),
(4, 'SUGAR', '无糖', 0.00, 1), (4, 'SUGAR', '三分糖', 0.00, 2), (4, 'SUGAR', '五分糖', 0.00, 3), (4, 'SUGAR', '标准糖', 0.00, 4),
-- 摩卡咖啡 (id=5)
(5, 'SIZE', '小杯', -2.00, 1), (5, 'SIZE', '中杯', 0.00, 2), (5, 'SIZE', '大杯', 4.00, 3),
(5, 'TEMP', '热饮', 0.00, 1), (5, 'TEMP', '少冰', 0.00, 2), (5, 'TEMP', '正常冰', 0.00, 3), (5, 'TEMP', '多冰', 0.00, 4),
(5, 'SUGAR', '无糖', 0.00, 1), (5, 'SUGAR', '三分糖', 0.00, 2), (5, 'SUGAR', '五分糖', 0.00, 3), (5, 'SUGAR', '标准糖', 0.00, 4),
-- 抹茶拿铁 (id=6)
(6, 'SIZE', '小杯', -2.00, 1), (6, 'SIZE', '中杯', 0.00, 2), (6, 'SIZE', '大杯', 4.00, 3),
(6, 'TEMP', '热饮', 0.00, 1), (6, 'TEMP', '少冰', 0.00, 2), (6, 'TEMP', '正常冰', 0.00, 3), (6, 'TEMP', '多冰', 0.00, 4),
(6, 'SUGAR', '无糖', 0.00, 1), (6, 'SUGAR', '三分糖', 0.00, 2), (6, 'SUGAR', '五分糖', 0.00, 3), (6, 'SUGAR', '标准糖', 0.00, 4);

-- -------------------------------------------
-- 储值套餐
-- -------------------------------------------
INSERT INTO `wlt_recharge_package` (`id`, `amount`, `bonus`, `is_recommend`, `sort_order`) VALUES
(1, 100.00, 10.00, 0, 1),
(2, 200.00, 30.00, 1, 2),
(3, 500.00, 100.00, 0, 3),
(4, 1000.00, 300.00, 0, 4);

-- -------------------------------------------
-- 积分兑换商品
-- -------------------------------------------
INSERT INTO `pts_product` (`id`, `name`, `image_url`, `points`, `stock`) VALUES
(1, '拿铁券', '/images/latte.jpg', 200, 50),
(2, '美式券', '/images/americano.jpg', 150, 80),
(3, '可颂券', '/images/croissant.jpg', 100, 100),
(4, '精品咖啡豆', '/images/beans.jpg', 500, 20);

-- -------------------------------------------
-- 门店
-- -------------------------------------------
INSERT INTO `cfg_store` (`id`, `name`, `address`, `phone`, `latitude`, `longitude`, `business_hours`) VALUES
(1, '摸鱼咖啡（万象城店）', '深圳市南山区深南大道9668号万象城B1层', '0755-88888888', 22.5362000, 113.9520000, '08:00-22:00');

-- -------------------------------------------
-- 优惠券 (系统预设)
-- -------------------------------------------
INSERT INTO `cpn_coupon` (`id`, `name`, `type`, `discount_value`, `min_amount`, `total_count`, `received_count`, `valid_days`) VALUES
(1, '新人8折券', 'DISCOUNT', 8.00, 0.00, 1000, 0, 30),
(2, '满50减10', 'FIXED', 10.00, 50.00, 500, 0, 30),
(3, '任意消费减5元', 'FIXED', 5.00, 0.00, 500, 0, 15);

-- -------------------------------------------
-- 测试用户 (openid: test_openid_001, 手机: 13800138000)
-- -------------------------------------------
INSERT INTO `sys_user` (`id`, `openid`, `nickname`, `avatar_url`, `phone`, `status`, `last_login_time`, `register_time`) VALUES
(1, 'test_openid_001', '摸鱼用户', '/images/default-avatar.png', '13800138000', 1, NOW(), '2026-01-15 09:00:00');

-- 测试用户储值账户 (初始余额128元)
INSERT INTO `wlt_account` (`user_id`, `balance`, `total_recharge`) VALUES
(1, 128.00, 200.00);

-- 测试用户积分账户 (360积分)
INSERT INTO `pts_account` (`user_id`, `balance`, `total_earned`) VALUES
(1, 360, 500);

-- 测试用户储值交易记录
INSERT INTO `wlt_transaction` (`user_id`, `type`, `amount`, `balance_after`, `description`, `create_time`) VALUES
(1, 'RECHARGE', 200.00, 200.00, '储值套餐 200元送30元', '2026-03-24 10:15:00'),
(1, 'CONSUME', -28.00, 172.00, '拿铁咖啡 中杯/热饮/标准糖', '2026-03-25 14:30:00'),
(1, 'CONSUME', -52.00, 128.00, '卡布奇诺×2 中杯/热饮/标准糖', '2026-03-23 16:45:00');

-- 测试用户积分记录
INSERT INTO `pts_record` (`user_id`, `type`, `points`, `balance_after`, `description`, `create_time`) VALUES
(1, 'SIGN_IN', 10, 360, '每日签到', '2026-03-25 08:00:00'),
(1, 'ORDER', 28, 350, '消费获积分 订单#2026032514300001', '2026-03-25 14:30:00'),
(1, 'EXCHANGE', -200, 150, '兑换拿铁券', '2026-03-24 12:00:00');

-- 测试用户领取的优惠券
INSERT INTO `cpn_user_coupon` (`id`, `coupon_id`, `user_id`, `status`, `receive_time`, `expire_time`) VALUES
(1, 1, 1, 'UNUSED', '2026-03-20 10:00:00', '2026-04-19 10:00:00'),
(2, 2, 1, 'UNUSED', '2026-03-22 15:00:00', '2026-04-21 15:00:00'),
(3, 3, 1, 'UNUSED', '2026-03-25 09:00:00', '2026-04-09 09:00:00');

-- -------------------------------------------
-- 测试订单数据
-- -------------------------------------------
INSERT INTO `ord_order` (`id`, `order_no`, `user_id`, `store_id`, `status`, `total_amount`, `discount_amount`, `pay_amount`, `pay_type`, `pay_time`, `pickup_code`, `create_time`) VALUES
(1, '202603251430000001', 1, 1, 'completed', 52.00, 0.00, 52.00, 'WALLET', '2026-03-25 14:30:05', '3456', '2026-03-25 14:30:00'),
(2, '202603241015000002', 1, 1, 'completed', 52.00, 0.00, 52.00, 'WALLET', '2026-03-24 10:15:10', '7890', '2026-03-24 10:15:00'),
(3, '202603231645000003', 1, 1, 'ready', 48.00, 0.00, 48.00, 'WALLET', '2026-03-23 16:45:08', '8888', '2026-03-23 16:45:00');

INSERT INTO `ord_order_item` (`order_id`, `product_id`, `product_name`, `product_image`, `size`, `temp`, `sugar`, `price`, `quantity`, `subtotal`) VALUES
(1, 1, '拿铁咖啡', '/images/latte.jpg', '中杯', '热饮', '标准糖', 28.00, 1, 28.00),
(1, 2, '美式咖啡', '/images/americano.jpg', '大杯', '热饮', '标准糖', 24.00, 1, 24.00),
(2, 4, '卡布奇诺', '/images/cappuccino.jpg', '中杯', '热饮', '标准糖', 26.00, 2, 52.00),
(3, 3, '冰咖啡', '/images/iced-coffee.jpg', '大杯', '正常冰', '标准糖', 30.00, 1, 30.00),
(3, 7, '可颂', '/images/croissant.jpg', NULL, NULL, NULL, 18.00, 1, 18.00);

INSERT INTO `ord_order_log` (`order_id`, `from_status`, `to_status`, `remark`, `create_time`) VALUES
(1, NULL, 'pending', '用户下单', '2026-03-25 14:30:00'),
(1, 'pending', 'paid', '储值支付成功', '2026-03-25 14:30:05'),
(1, 'paid', 'preparing', '自动接单', '2026-03-25 14:31:00'),
(1, 'preparing', 'ready', '制作完成，取餐码3456', '2026-03-25 14:40:00'),
(1, 'ready', 'completed', '用户已取餐', '2026-03-25 14:45:00'),
(3, NULL, 'pending', '用户下单', '2026-03-23 16:45:00'),
(3, 'pending', 'paid', '储值支付成功', '2026-03-23 16:45:08'),
(3, 'paid', 'preparing', '自动接单', '2026-03-23 16:46:00'),
(3, 'preparing', 'ready', '制作完成，取餐码8888', '2026-03-23 16:55:00');

-- 升级: 已有数据库添加birthday字段
ALTER TABLE `sys_user` ADD COLUMN `birthday` VARCHAR(16) COMMENT '生日 yyyy-MM-dd' AFTER `phone`;

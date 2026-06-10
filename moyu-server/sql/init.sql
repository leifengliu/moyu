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

-- 规格组模板
CREATE TABLE `prd_spec_group` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `name` VARCHAR(32) NOT NULL COMMENT '规格组名',
  `selection_type` VARCHAR(16) DEFAULT 'SINGLE' COMMENT 'SINGLE单选/MULTI多选',
  `sort_order` INT DEFAULT 0,
  `status` TINYINT DEFAULT 1,
  `create_time` DATETIME DEFAULT CURRENT_TIMESTAMP,
  `update_time` DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规格组模板';

-- 规格选项模板
CREATE TABLE `prd_spec_option` (
  `id` BIGINT PRIMARY KEY AUTO_INCREMENT,
  `group_id` BIGINT NOT NULL,
  `value` VARCHAR(32) NOT NULL COMMENT '选项名',
  `price_adjust` DECIMAL(10,2) DEFAULT 0,
  `sort_order` INT DEFAULT 0,
  KEY `idx_group` (`group_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='规格选项模板';

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
('咖啡系列', 'coffee', 2, 'Coffee'),
('零咖系列', 'caffeine-free', 3, 'Coffee'),
('椰子水系列', 'coconut', 4, 'Coffee'),
('气泡系列', 'sparkling', 5, 'Coffee'),
('柠檬茶系列', 'lemon-tea', 6, 'Coffee'),
('周边', 'merch', 7, 'Coffee');

-- -------------------------------------------
-- 规格组模板 & 选项
-- -------------------------------------------
INSERT INTO `prd_spec_group` (`id`, `name`, `selection_type`, `sort_order`, `status`) VALUES
(1, '温度', 'SINGLE', 1, 1),
(2, '糖度', 'SINGLE', 2, 1),
(3, '烘培度', 'SINGLE', 3, 1);

INSERT INTO `prd_spec_option` (`id`, `group_id`, `value`, `price_adjust`, `sort_order`) VALUES
-- 温度
(1, 1, '热', 0.00, 1),
(2, 1, '标准冰', 0.00, 2),
(3, 1, '少冰', 0.00, 3),
(4, 1, '去冰', 0.00, 4),
-- 糖度
(5, 2, '无糖', 0.00, 1),
(6, 2, '少糖', 0.00, 2),
(7, 2, '正常糖', 0.00, 3),
-- 烘培度
(8, 3, '中烘', 0.00, 1),
(9, 3, '中深烘', 0.00, 2);

-- -------------------------------------------
-- 商品
-- -------------------------------------------
INSERT INTO `prd_product` (`id`, `category_id`, `name`, `description`, `image_url`, `base_price`, `status`, `is_recommend`, `is_new`, `sales_count`, `sort_order`) VALUES
-- 一、咖啡系列 (category_id=2) -- 11款
(1, 2, '经典美式', '纯粹黑咖啡，提神醒脑。可选中烘或中深烘豆', '/images/drink.png', 15.00, 1, 1, 0, 620, 1),
(2, 2, '椰青美式', '椰子水搭配美式咖啡，清甜与醇苦的碰撞', '/images/drink.png', 17.00, 1, 1, 0, 480, 2),
(3, 2, '油柑冰美式', '潮汕油柑入咖，回甘悠长，夏日解暑特调', '/images/drink.png', 17.00, 1, 0, 1, 410, 3),
(4, 2, '鲜奶拿铁', '新鲜牛乳融入浓缩咖啡，丝滑顺口', '/images/drink.png', 17.00, 1, 1, 0, 560, 4),
(5, 2, '生椰拿铁', '天然生椰乳与咖啡的完美融合，椰香浓郁', '/images/drink.png', 17.00, 1, 1, 0, 530, 5),
(6, 2, '香草拿铁', '马达加斯加香草风味，甜蜜不腻', '/images/drink.png', 18.00, 1, 0, 0, 390, 6),
(7, 2, '黄油拿铁', '黄油醇厚，奶香倍增，口感浓郁绵密', '/images/drink.png', 20.00, 1, 0, 1, 340, 7),
(8, 2, '焦糖拿铁', '焦糖的甜与咖啡的苦交织，经典风味', '/images/drink.png', 18.00, 1, 0, 0, 370, 8),
(9, 2, '牛油果拿铁', '墨西哥牛油果泥融入拿铁，丝滑健康', '/images/drink.png', 25.00, 1, 0, 1, 280, 9),
-- 二、零咖系列 (category_id=3) -- 8款
(10, 3, '红茶拿铁', '锡兰红茶与鲜奶的经典搭配，无咖啡因', '/images/drink.png', 15.00, 1, 0, 0, 380, 10),
(11, 3, '抹茶拿铁', '日本宇治抹茶，清新回甘，健康好喝', '/images/drink.png', 25.00, 1, 1, 0, 450, 11),
(12, 3, '抹茶生椰', '抹茶遇见生椰乳，清新与浓郁双重享受', '/images/drink.png', 18.00, 1, 0, 1, 320, 12),
(13, 3, '芭乐茉莉椰', '红心芭乐 × 茉莉花茶 × 椰乳，果香四溢', '/images/drink.png', 18.00, 1, 0, 0, 290, 13),
(14, 3, '柠檬打奶', '鲜榨柠檬撞鲜奶，酸甜清爽', '/images/drink.png', 15.00, 1, 0, 0, 350, 14),
(15, 3, '港式奶茶', '经典港式丝袜奶茶，茶浓奶滑', '/images/drink.png', 12.00, 1, 1, 0, 510, 15),
(16, 3, '台式奶茶', '台湾风味奶茶，温润顺滑', '/images/drink.png', 12.00, 1, 0, 0, 470, 16),
-- 三、椰子水系列 (category_id=4) -- 2款
(17, 4, '开心果清椰', '开心果酱 × 清椰水，坚果与椰香的奇妙组合', '/images/drink.png', 28.00, 1, 0, 1, 220, 17),
(18, 4, '抹茶清椰', '抹茶融入清椰水，纯天然零添加', '/images/drink.png', 25.00, 1, 0, 0, 200, 18),
-- 四、气泡系列 (category_id=5) -- 2款
(19, 5, '香柠奇异果气泡', '新西兰奇异果搭配香水柠檬，气泡十足', '/images/drink.png', 15.00, 1, 0, 0, 310, 19),
(20, 5, '葡萄气泡', '巨峰葡萄果肉 × 气泡水，粒粒分明', '/images/drink.png', 15.00, 1, 0, 0, 280, 20),
-- 五、柠檬茶系列 (category_id=6) -- 10款
(21, 6, '鸭屎香柠檬茶', '潮州凤凰单丛茶底，茶香独特，回甘持久', '/images/drink.png', 12.00, 1, 1, 0, 540, 21),
(22, 6, '茉莉柠檬茶', '茉莉花茶底搭配鲜柠，花香清雅', '/images/drink.png', 12.00, 1, 0, 0, 460, 22),
(23, 6, '金桔柠檬', '金桔与柠檬的酸甜碰撞，维C满满', '/images/drink.png', 14.00, 1, 0, 0, 420, 23),
(24, 6, '芭乐柠檬茶', '红心芭乐果肉 × 柠檬茶，少女心爆款', '/images/drink.png', 15.00, 1, 0, 0, 380, 24),
(25, 6, '桑葚柠檬茶', '鲜桑葚果肉入茶，酸甜多汁', '/images/drink.png', 15.00, 1, 0, 0, 340, 25),
(26, 6, '鲜橙柠檬茶', '鲜榨橙汁融入柠檬茶，果香层次丰富', '/images/drink.png', 15.00, 1, 0, 0, 330, 26),
(27, 6, '香茅柠檬茶', '东南亚香茅草 × 柠檬茶，异域风情', '/images/drink.png', 13.00, 1, 0, 1, 290, 27),
(28, 6, '话梅老盐柠檬茶', '咸话梅与老盐遇见柠檬茶，咸甜回甘', '/images/drink.png', 13.00, 1, 0, 1, 310, 28),
(29, 6, '港式冻柠茶', '港式茶餐厅经典冻柠茶，茶浓柠香', '/images/drink.png', 13.00, 1, 1, 0, 500, 29),
-- 周边 (category_id=7)
(30, 7, '咖啡豆', '精选阿拉比卡咖啡豆，产地直采，家用首选', '/images/clothes-test.png', 88.00, 1, 0, 0, 90, 30),
(31, 7, '品牌T恤', '100%纯棉，经典Logo，摸鱼咖啡联名款', '/images/clothes-test.png', 199.00, 1, 0, 0, 0, 31),
(32, 7, '帆布袋', '环保耐用，时尚百搭，日常出行必备', '/images/clothes-test.png', 59.00, 1, 0, 0, 0, 32),
(33, 7, '帽子', '棒球帽，刺绣Logo，潮流搭配', '/images/clothes-test.png', 89.00, 1, 0, 0, 0, 33);

-- -------------------------------------------
-- 商品规格 (按真实菜单配置)
-- -------------------------------------------
INSERT INTO `prd_product_spec` (`product_id`, `spec_type`, `spec_value`, `price_adjust`, `sort_order`) VALUES
-- 1. 经典美式: 温度(热/标准冰/少冰/去冰) + 烘培度(中烘/中深烘)
(1, '温度', '热', 0, 1), (1, '温度', '标准冰', 0, 2), (1, '温度', '少冰', 0, 3), (1, '温度', '去冰', 0, 4),
(1, '烘培度', '中烘', 0, 1), (1, '烘培度', '中深烘', 0, 2),
-- 2. 椰青美式: 温度(标准冰/热)
(2, '温度', '标准冰', 0, 1), (2, '温度', '热', 0, 2),
-- 3. 油柑冰美式: 温度(仅标准冰) + 糖度(正常糖/不加糖)
(3, '温度', '标准冰', 0, 1),
(3, '糖度', '正常糖', 0, 1), (3, '糖度', '不加糖', 0, 2),
-- 4. 鲜奶拿铁: 温度(标准冰/热)
(4, '温度', '标准冰', 0, 1), (4, '温度', '热', 0, 2),
-- 5. 生椰拿铁: 温度(标准冰/热)
(5, '温度', '标准冰', 0, 1), (5, '温度', '热', 0, 2),
-- 6. 香草拿铁: 温度(标准冰/热)
(6, '温度', '标准冰', 0, 1), (6, '温度', '热', 0, 2),
-- 7. 黄油拿铁: 温度(标准冰/热)
(7, '温度', '标准冰', 0, 1), (7, '温度', '热', 0, 2),
-- 8. 焦糖拿铁: 温度(标准冰/热)
(8, '温度', '标准冰', 0, 1), (8, '温度', '热', 0, 2),
-- 9. 牛油果拿铁: 温度(仅标准冰)
(9, '温度', '标准冰', 0, 1),
-- 10. 红茶拿铁: 温度(标准冰/热) + 糖度(无糖/少糖/正常糖)
(10, '温度', '标准冰', 0, 1), (10, '温度', '热', 0, 2),
(10, '糖度', '无糖', 0, 1), (10, '糖度', '少糖', 0, 2), (10, '糖度', '正常糖', 0, 3),
-- 11. 抹茶拿铁: 温度(标准冰/热) + 糖度(无糖/少糖/正常糖)
(11, '温度', '标准冰', 0, 1), (11, '温度', '热', 0, 2),
(11, '糖度', '无糖', 0, 1), (11, '糖度', '少糖', 0, 2), (11, '糖度', '正常糖', 0, 3),
-- 12. 抹茶生椰: 温度(标准冰/热)
(12, '温度', '标准冰', 0, 1), (12, '温度', '热', 0, 2),
-- 13. 芭乐茉莉椰: 温度(仅标准冰)
(13, '温度', '标准冰', 0, 1),
-- 14. 柠檬打奶: 温度(仅标准冰) + 糖度(正常糖/少糖)
(14, '温度', '标准冰', 0, 1),
(14, '糖度', '正常糖', 0, 1), (14, '糖度', '少糖', 0, 2),
-- 15. 港式奶茶: 温度(标准冰/热) + 糖度(正常糖/少糖)
(15, '温度', '标准冰', 0, 1), (15, '温度', '热', 0, 2),
(15, '糖度', '正常糖', 0, 1), (15, '糖度', '少糖', 0, 2),
-- 16. 台式奶茶: 温度(标准冰/热)
(16, '温度', '标准冰', 0, 1), (16, '温度', '热', 0, 2),
-- 17. 开心果清椰: 温度(仅标准冰)
(17, '温度', '标准冰', 0, 1),
-- 18. 抹茶清椰: 温度(仅标准冰)
(18, '温度', '标准冰', 0, 1),
-- 19. 香柠奇异果气泡: 温度(仅标准冰)
(19, '温度', '标准冰', 0, 1),
-- 20. 葡萄气泡: 温度(仅标准冰)
(20, '温度', '标准冰', 0, 1),
-- 21-29. 柠檬茶系列: 温度(标准冰/少冰) + 糖度(标准糖/少糖/无糖)
(21, '温度', '标准冰', 0, 1), (21, '温度', '少冰', 0, 2),
(21, '糖度', '标准糖', 0, 1), (21, '糖度', '少糖', 0, 2), (21, '糖度', '无糖', 0, 3),
(22, '温度', '标准冰', 0, 1), (22, '温度', '少冰', 0, 2),
(22, '糖度', '标准糖', 0, 1), (22, '糖度', '少糖', 0, 2), (22, '糖度', '无糖', 0, 3),
(23, '温度', '标准冰', 0, 1), (23, '温度', '少冰', 0, 2),
(23, '糖度', '标准糖', 0, 1), (23, '糖度', '少糖', 0, 2), (23, '糖度', '无糖', 0, 3),
(24, '温度', '标准冰', 0, 1), (24, '温度', '少冰', 0, 2),
(24, '糖度', '标准糖', 0, 1), (24, '糖度', '少糖', 0, 2), (24, '糖度', '无糖', 0, 3),
(25, '温度', '标准冰', 0, 1), (25, '温度', '少冰', 0, 2),
(25, '糖度', '标准糖', 0, 1), (25, '糖度', '少糖', 0, 2), (25, '糖度', '无糖', 0, 3),
(26, '温度', '标准冰', 0, 1), (26, '温度', '少冰', 0, 2),
(26, '糖度', '标准糖', 0, 1), (26, '糖度', '少糖', 0, 2), (26, '糖度', '无糖', 0, 3),
(27, '温度', '标准冰', 0, 1), (27, '温度', '少冰', 0, 2),
(27, '糖度', '标准糖', 0, 1), (27, '糖度', '少糖', 0, 2), (27, '糖度', '无糖', 0, 3),
(28, '温度', '标准冰', 0, 1), (28, '温度', '少冰', 0, 2),
(28, '糖度', '标准糖', 0, 1), (28, '糖度', '少糖', 0, 2), (28, '糖度', '无糖', 0, 3),
(29, '温度', '标准冰', 0, 1), (29, '温度', '少冰', 0, 2),
(29, '糖度', '标准糖', 0, 1), (29, '糖度', '少糖', 0, 2), (29, '糖度', '无糖', 0, 3);

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
(1, '拿铁券', '/images/drink.png', 200, 50),
(2, '美式券', '/images/drink.png', 150, 80),
(3, '可颂券', '/images/drink.png', 100, 100),
(4, '精品咖啡豆', '/images/drink.png', 500, 20);

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
(1, 'CONSUME', -32.00, 168.00, '经典美式+生椰拿铁', '2026-03-25 14:30:00'),
(1, 'CONSUME', -34.00, 134.00, '鲜奶拿铁×2', '2026-03-23 16:45:00');

-- 测试用户积分记录
INSERT INTO `pts_record` (`user_id`, `type`, `points`, `balance_after`, `description`, `create_time`) VALUES
(1, 'SIGN_IN', 10, 360, '每日签到', '2026-03-25 08:00:00'),
(1, 'ORDER', 32, 350, '消费获积分 订单#2026032514300001', '2026-03-25 14:30:00'),
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
(1, '202603251430000001', 1, 1, 'completed', 32.00, 0.00, 32.00, 'WALLET', '2026-03-25 14:30:05', '3456', '2026-03-25 14:30:00'),
(2, '202603241015000002', 1, 1, 'completed', 34.00, 0.00, 34.00, 'WALLET', '2026-03-24 10:15:10', '7890', '2026-03-24 10:15:00'),
(3, '202603231645000003', 1, 1, 'ready', 24.00, 0.00, 24.00, 'WALLET', '2026-03-23 16:45:08', '8888', '2026-03-23 16:45:00');

INSERT INTO `ord_order_item` (`order_id`, `product_id`, `product_name`, `product_image`, `size`, `temp`, `sugar`, `price`, `quantity`, `subtotal`) VALUES
(1, 1, '经典美式', '/images/drink.png', NULL, '热', '标准糖', 15.00, 1, 15.00),
(1, 5, '生椰拿铁', '/images/drink.png', NULL, '标准冰', '标准糖', 17.00, 1, 17.00),
(2, 4, '鲜奶拿铁', '/images/drink.png', NULL, '热', '标准糖', 17.00, 2, 34.00),
(3, 21, '鸭屎香柠檬茶', '/images/drink.png', NULL, '标准冰', '标准糖', 12.00, 1, 12.00),
(3, 15, '港式奶茶', '/images/drink.png', NULL, '标准冰', '正常糖', 12.00, 1, 12.00);

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

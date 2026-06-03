import { Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Menu() {
  const [activeCategory, setActiveCategory] = useState('coffee');
  const [cartCount, setCartCount] = useState(0);

  const categories = [
    { id: 'coffee', name: '咖啡' },
    { id: 'special', name: '特调' },
    { id: 'snacks', name: '小食' },
    { id: 'drinks', name: '茶饮' },
  ];
  
  const products = [
    {
      id: 1,
      name: '拿铁咖啡',
      desc: '经典浓郁，奶香十足',
      price: 28,
      memberPrice: 25,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NDU1MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 2,
      name: '美式咖啡',
      desc: '纯粹黑咖啡，提神醒脑',
      price: 22,
      memberPrice: 20,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1634568574054-0ab278fdc1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc0NDQwMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 3,
      name: '冰咖啡',
      desc: '冰爽清凉，夏日必备',
      price: 30,
      memberPrice: 27,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1723856016470-1b0b0cd2e409?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwY29mZmVlJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NDQ0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 4,
      name: '卡布奇诺',
      desc: '绵密奶泡，口感丰富',
      price: 26,
      memberPrice: 24,
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1769255119648-4c49674477b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwY29mZmVlJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzQ0NTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 5,
      name: '摩卡咖啡',
      desc: '巧克力与咖啡的完美融合',
      price: 32,
      memberPrice: 29,
      category: 'special',
      image: 'https://images.unsplash.com/photo-1593382067370-218be4145075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2NoYSUyMGNvZmZlZSUyMGRyaW5rfGVufDF8fHx8MTc3NDM5NzM5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 6,
      name: '抹茶拿铁',
      desc: '清新抹茶，健康好喝',
      price: 32,
      memberPrice: 29,
      category: 'special',
      image: 'https://images.unsplash.com/photo-1638978127697-e4d55e88a6e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZSUyMGdyZWVuJTIwdGVhfGVufDF8fHx8MTc3NDQwMzg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 7,
      name: '可颂',
      desc: '现烤可颂，酥脆可口',
      price: 18,
      memberPrice: 16,
      category: 'snacks',
      image: 'https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc0Mzg2NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral'
    },
    {
      id: 8,
      name: '柠檬茶',
      desc: '清新柠檬，解渴提神',
      price: 26,
      memberPrice: 23,
      category: 'drinks',
      image: 'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600'
    },
  ];
  
  const filteredProducts = products.filter(p => p.category === activeCategory);
  const [isMember] = useState(false); // 模拟会员状态

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header - 适配微信小程序胶囊按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E3DF]">
        <div className="h-11" />

        <div className="px-6 pb-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-base tracking-[0.15em] text-[#2C2C2C]">点单</h1>
            {/* 预留胶囊按钮空间 */}
            <div className="w-[103px]" />
          </div>

          <div className="flex items-center gap-3 bg-[#F5F5F3] px-4 py-3.5 border border-[#E5E3DF]">
            <Search className="w-4 h-4 text-[#8B8680]" />
            <input
              type="text"
              placeholder="搜索商品..."
              className="flex-1 bg-transparent outline-none text-sm text-[#2C2C2C] placeholder:text-[#A09C97]"
            />
          </div>
        </div>
      </div>

      {/* 分类 + 商品 - 左右布局 */}
      <div className="flex h-[calc(100vh-180px)]">
        {/* 左侧分类导航 */}
        <div className="w-24 bg-white border-r border-[#E5E3DF] overflow-y-auto">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`w-full py-5 text-xs text-center border-b border-[#E5E3DF] transition-colors ${
                activeCategory === category.id
                  ? 'bg-[#FAFAF8] text-[#4A3428] font-medium border-l-2 border-l-[#4A3428]'
                  : 'text-[#8B8680]'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* 右侧商品列表 */}
        <div className="flex-1 overflow-y-auto bg-[#FAFAF8]">
      
          <div className="px-4 py-4 space-y-3">
            {filteredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link to={`/product/${product.id}`}>
                  <div className="flex gap-4 bg-white p-4 border border-[#E5E3DF] hover:border-[#4A3428] transition-colors">
                    <div className="w-20 h-20 overflow-hidden flex-shrink-0 bg-[#F5F5F3]">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="text-sm text-[#2C2C2C] mb-1">{product.name}</h3>
                        <p className="text-xs text-[#8B8680] leading-relaxed">{product.desc}</p>
                      </div>
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-baseline gap-2">
                          {isMember && (
                            <>
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-xs text-[#4A3428]">¥</span>
                                <span className="text-base text-[#4A3428] font-medium">{product.memberPrice}</span>
                              </div>
                              <div className="flex items-baseline gap-0.5">
                                <span className="text-xs text-[#A09C97] line-through">¥</span>
                                <span className="text-sm text-[#A09C97] line-through">{product.price}</span>
                              </div>
                            </>
                          )}
                          {!isMember && (
                            <div className="flex items-baseline gap-0.5">
                              <span className="text-xs text-[#8B8680]">¥</span>
                              <span className="text-base text-[#4A3428]">{product.price}</span>
                            </div>
                          )}
                        </div>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.preventDefault();
                            setCartCount(cartCount + 1);
                          }}
                          className="w-7 h-7 bg-[#4A3428] flex items-center justify-center text-white text-sm hover:bg-[#6B4F3E] transition-colors"
                        >
                          +
                        </motion.button>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Cart Button */}
      {cartCount > 0 && (
        <Link to="/cart">
          <motion.button
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="fixed right-6 bottom-24 w-14 h-14 bg-[#4A3428] flex items-center justify-center shadow-lg"
          >
            <ShoppingCart className="w-6 h-6 text-white" />
            <span className="absolute -top-2 -right-2 w-6 h-6 bg-[#C9A67A] text-[#4A3428] text-xs flex items-center justify-center font-medium">
              {cartCount}
            </span>
          </motion.button>
        </Link>
      )}

      <BottomNav />
    </div>
  );
}

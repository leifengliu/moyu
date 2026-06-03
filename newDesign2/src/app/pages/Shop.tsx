import { Search, ShoppingCart } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Shop() {
  const [cartCount, setCartCount] = useState(0);
  const [isMember] = useState(false);

  const products = [
    {
      id: 1,
      name: '品牌T恤',
      desc: '100%纯棉，经典Logo',
      price: 199,
      memberPrice: 179,
      image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=600',
      category: '服饰',
    },
    {
      id: 2,
      name: '帆布袋',
      desc: '环保耐用，时尚百搭',
      price: 59,
      memberPrice: 49,
      image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600',
      category: '服饰',
    },
    {
      id: 3,
      name: '咖啡豆 200g',
      desc: '精选咖啡豆，家用首选',
      price: 88,
      memberPrice: 79,
      image: 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzc0NDU1MTUxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      category: '周边',
    },
    {
      id: 4,
      name: '咖啡杯',
      desc: '陶瓷材质，温润手感',
      price: 68,
      memberPrice: 59,
      image: 'https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=600',
      category: '周边',
    },
    {
      id: 5,
      name: '帽子',
      desc: '棒球帽，刺绣Logo',
      price: 89,
      memberPrice: 79,
      image: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=600',
      category: '服饰',
    },
    {
      id: 6,
      name: '手冲壶',
      desc: '304不锈钢，精准控水',
      price: 158,
      memberPrice: 139,
      image: 'https://images.unsplash.com/photo-1611564391107-d2c83de16c66?w=600',
      category: '周边',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E3DF]">
        <div className="h-11" />
        <div className="px-6 pb-4">
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

      {/* Banner */}
      <div className="px-6 pt-6 pb-4 bg-white">
        <div className="bg-gradient-to-br from-[#4A3428] to-[#6B4F3E] p-8 relative overflow-hidden">
          <div className="relative z-10">
            <p className="text-xs text-[#C9A67A] mb-2 tracking-wider">MOYU LIFESTYLE</p>
            <h2 className="text-xl text-white mb-1">品牌周边</h2>
            <p className="text-sm text-white/80">精选好物，咖啡生活</p>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="px-6 pt-6 pb-6 bg-[#FAFAF8]">
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="bg-white border border-[#E5E3DF] overflow-hidden group hover:border-[#4A3428] transition-colors">
                  <div className="aspect-square overflow-hidden bg-[#F5F5F3]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4">
                    <div className="mb-2">
                      <span className="text-[10px] text-[#8B8680] tracking-wide">{product.category}</span>
                    </div>
                    <h3 className="text-sm text-[#2C2C2C] mb-1">{product.name}</h3>
                    <p className="text-xs text-[#8B8680] mb-3 line-clamp-1">{product.desc}</p>
                    <div className="flex items-baseline justify-between">
                      {isMember ? (
                        <div className="flex items-baseline gap-2">
                          <div className="flex items-baseline gap-0.5">
                            <span className="text-xs text-[#4A3428]">¥</span>
                            <span className="text-base text-[#4A3428] font-medium">{product.memberPrice}</span>
                          </div>
                          <span className="text-xs text-[#A09C97] line-through">¥{product.price}</span>
                        </div>
                      ) : (
                        <div className="flex items-baseline gap-0.5">
                          <span className="text-xs text-[#8B8680]">¥</span>
                          <span className="text-base text-[#4A3428]">{product.price}</span>
                        </div>
                      )}
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

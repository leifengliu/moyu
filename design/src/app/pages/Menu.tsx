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
    { id: 'merch', name: '周边' },
  ];
  
  const products = [
    { 
      id: 1, 
      name: '拿铁咖啡', 
      desc: '经典浓郁，奶香十足',
      price: 28, 
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NDU1MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 2, 
      name: '美式咖啡', 
      desc: '纯粹黑咖啡，提神醒脑',
      price: 22, 
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1634568574054-0ab278fdc1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cCUyMG1pbmltYWxpc3R8ZW58MXx8fHwxNzc0NDQwMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 3, 
      name: '冰咖啡', 
      desc: '冰爽清凉，夏日必备',
      price: 30, 
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1723856016470-1b0b0cd2e409?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwY29mZmVlJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NDQ0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 4, 
      name: '卡布奇诺', 
      desc: '绵密奶泡，口感丰富',
      price: 26, 
      category: 'coffee',
      image: 'https://images.unsplash.com/photo-1769255119648-4c49674477b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwY29mZmVlJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzQ0NTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 5, 
      name: '摩卡咖啡', 
      desc: '巧克力与咖啡的完美融合',
      price: 32, 
      category: 'special',
      image: 'https://images.unsplash.com/photo-1593382067370-218be4145075?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2NoYSUyMGNvZmZlZSUyMGRyaW5rfGVufDF8fHx8MTc3NDM5NzM5MXww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 6, 
      name: '抹茶拿铁', 
      desc: '清新抹茶，健康好喝',
      price: 32, 
      category: 'special',
      image: 'https://images.unsplash.com/photo-1638978127697-e4d55e88a6e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtYXRjaGElMjBsYXR0ZSUyMGdyZWVuJTIwdGVhfGVufDF8fHx8MTc3NDQwMzg2NHww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 7, 
      name: '可颂', 
      desc: '现烤可颂，酥脆可口',
      price: 18, 
      category: 'snacks',
      image: 'https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc0Mzg2NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 8, 
      name: '咖啡豆', 
      desc: '精选咖啡豆，家用首选',
      price: 88, 
      category: 'merch',
      image: 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzc0NDU1MTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
  ];
  
  const filteredProducts = products.filter(p => p.category === activeCategory);
  
  return (
    <div className="min-h-screen bg-[#F8F6F3] pb-20">
      {/* Header - 适配微信小程序胶囊按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E8DED3]">
        <div className="h-11" />
        
        <div className="px-6 pb-4">
          <div className="flex items-center gap-3 bg-[#F8F6F3] rounded-lg px-4 py-3 mb-4">
            <Search className="w-5 h-5 text-[#8B8680]" />
            <input 
              type="text" 
              placeholder="搜索商品..." 
              className="flex-1 bg-transparent outline-none text-sm text-[#1A1A1A] placeholder:text-[#8B8680]"
            />
          </div>
          
          <div className="flex gap-3 overflow-x-auto scrollbar-hide">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-5 py-2 rounded-lg text-sm transition-all whitespace-nowrap border ${
                  activeCategory === category.id 
                    ? 'bg-[#1A1614] text-[#C9A961] border-[#1A1614]' 
                    : 'bg-white text-[#8B8680] border-[#E8DED3]'
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Products */}
      <div className="px-6 py-6">
        <div className="space-y-5">
          {filteredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="flex gap-4 bg-white rounded-lg overflow-hidden border border-[#E8DED3] p-4">
                  <div className="w-28 h-28 rounded-lg overflow-hidden flex-shrink-0 bg-[#F8F6F3]">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <div>
                      <h3 className="text-base text-[#1A1A1A] mb-2">{product.name}</h3>
                      <p className="text-xs text-[#8B8680] leading-relaxed">{product.desc}</p>
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-xs text-[#8B8680]">¥</span>
                        <span className="text-xl text-[#C9A961]">{product.price}</span>
                      </div>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.preventDefault();
                          setCartCount(cartCount + 1);
                        }}
                        className="w-9 h-9 bg-[#1A1614] rounded-lg flex items-center justify-center text-[#C9A961] text-xl"
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
            className="fixed right-6 bottom-24 w-14 h-14 bg-[#1A1614] rounded-full flex items-center justify-center shadow-xl"
          >
            <ShoppingCart className="w-6 h-6 text-[#C9A961]" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#C9A961] rounded-full text-[#1A1614] text-xs flex items-center justify-center font-medium">
              {cartCount}
            </span>
          </motion.button>
        </Link>
      )}
      
      <BottomNav />
    </div>
  );
}

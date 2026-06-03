import { Search, Bell, Coffee, Sparkles } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';

export default function Home() {
  const categories = [
    { id: 1, name: '新品', icon: Sparkles },
    { id: 2, name: '经典咖啡', icon: Coffee },
    { id: 3, name: '特调', icon: Coffee },
    { id: 4, name: '周边', icon: Coffee },
  ];
  
  const products = [
    { 
      id: 1, 
      name: '拿铁咖啡', 
      price: 28, 
      image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NDU1MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 2, 
      name: '美式咖啡', 
      price: 22, 
      image: 'https://images.unsplash.com/photo-1634568574054-0ab278fdc1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cCUyMG1pbml0YWxpc3R8ZW58MXx8fHwxNzc0NDQwMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 3, 
      name: '冰咖啡', 
      price: 30, 
      image: 'https://images.unsplash.com/photo-1723856016470-1b0b0cd2e409?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxpY2VkJTIwY29mZmVlJTIwYWVzdGhldGljfGVufDF8fHx8MTc3NDQ0NTE1M3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
    { 
      id: 4, 
      name: '卡布奇诺', 
      price: 26, 
      image: 'https://images.unsplash.com/photo-1769255119648-4c49674477b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjYXBwdWNjaW5vJTIwY29mZmVlJTIwbWluaW1hbGlzdHxlbnwxfHx8fDE3NzQ0NTUxNTB8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral' 
    },
  ];
  
  return (
    <div className="min-h-screen bg-[#F8F6F3] pb-20">
      {/* Header - 适配微信小程序胶囊按钮 */}
      <div className="sticky top-0 z-40 bg-[#1A1614]">
        {/* 状态栏占位 */}
        <div className="h-11" />
        
        {/* 导航栏 - 左侧Logo，右侧预留胶囊按钮空间 */}
        <div className="flex items-center justify-between px-6 pb-3">
          <h1 className="text-xl tracking-wider text-[#C9A961]" style={{ fontFamily: 'serif' }}>
            摸鱼咖啡
          </h1>
          {/* 预留胶囊按钮空间 */}
          <div className="w-24" />
        </div>
      </div>
      
      {/* Search Bar */}
      <div className="px-6 py-6 bg-[#1A1614]">
        <div className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3 border border-white/20">
          <Search className="w-5 h-5 text-[#C9A961]" />
          <input 
            type="text" 
            placeholder="搜索咖啡、特调..." 
            className="flex-1 bg-transparent outline-none text-sm text-white placeholder:text-white/50"
          />
        </div>
      </div>
      
      {/* Banner */}
      <div className="px-6 py-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1614] rounded-lg overflow-hidden h-48 relative"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#C9A961]/20 to-transparent" />
          <div className="relative h-full flex flex-col justify-center px-8">
            <p className="text-xs text-[#C9A961] tracking-widest mb-2">EXCLUSIVE OFFER</p>
            <h3 className="text-2xl text-white mb-2" style={{ fontFamily: 'serif' }}>新会员专享</h3>
            <p className="text-sm text-white/70">注册即送拿铁券</p>
          </div>
        </motion.div>
      </div>
      
      {/* Categories */}
      <div className="px-6 pb-8">
        <div className="grid grid-cols-4 gap-6">
          {categories.map((category, index) => {
            const Icon = category.icon;
            return (
              <motion.button
                key={category.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex flex-col items-center gap-3"
              >
                <div className="w-14 h-14 bg-white rounded-lg flex items-center justify-center border border-[#E8DED3]">
                  <Icon className="w-6 h-6 text-[#C9A961]" />
                </div>
                <span className="text-xs text-[#1A1A1A]">{category.name}</span>
              </motion.button>
            );
          })}
        </div>
      </div>
      
      {/* Products */}
      <div className="px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg text-[#1A1A1A]" style={{ fontFamily: 'serif' }}>热门推荐</h2>
          <span className="text-xs text-[#8B8680] tracking-wider">FEATURED</span>
        </div>
        <div className="grid grid-cols-2 gap-5 pb-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="bg-white rounded-lg overflow-hidden border border-[#E8DED3]">
                  <div className="aspect-square overflow-hidden bg-[#F8F6F3]">
                    <img 
                      src={product.image} 
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-[#1A1A1A] mb-2">{product.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-[#8B8680]">¥</span>
                      <span className="text-lg text-[#C9A961]">{product.price}</span>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
      
      <BottomNav />
    </div>
  );
}
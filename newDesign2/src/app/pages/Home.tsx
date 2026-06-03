import { Search, Coffee, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';

export default function Home() {
  const quickLinks = [
    { id: 1, name: '点单', path: '/menu', icon: Coffee, color: 'from-[#4A3428] to-[#6B4F3E]' },
    { id: 2, name: '商店', path: '/shop', icon: ShoppingBag, color: 'from-[#6B4F3E] to-[#8B6F5E]' },
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
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header - 适配微信小程序胶囊按钮 */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E3DF]">
        {/* 状态栏占位 */}
        <div className="h-11" />

        {/* 导航栏 - 左侧Logo，右侧预留胶囊按钮空间（87px宽度+16px间距） */}
        <div className="flex items-center justify-between px-6 pb-4">
          <h1 className="text-base tracking-[0.15em] text-[#2C2C2C]">
            MOYU COFFEE
          </h1>
          {/* 预留胶囊按钮空间 - 微信小程序胶囊宽度约87px */}
          <div className="w-[103px]" />
        </div>
      </div>

      {/* Search Bar */}
      <div className="px-6 pt-6 bg-white">
        <div className="flex items-center gap-3 bg-[#F5F5F3] px-4 py-3.5 border border-[#E5E3DF]">
          <Search className="w-4 h-4 text-[#8B8680]" />
          <input
            type="text"
            placeholder="搜索咖啡、周边..."
            className="flex-1 bg-transparent outline-none text-sm text-[#2C2C2C] placeholder:text-[#A09C97]"
          />
        </div>
      </div>

      {/* Banner */}
      <div className="px-6 py-8 bg-white">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#4A3428] overflow-hidden h-56 relative"
        >
          <div className="relative h-full flex flex-col justify-between p-8">
            <div>
              <p className="text-[10px] text-[#C9A67A] tracking-[0.3em] mb-3 uppercase">New Member</p>
              <h3 className="text-3xl text-white tracking-tight">Welcome<br/>Gift</h3>
            </div>
            <div className="w-12 h-px bg-[#C9A67A]" />
          </div>
        </motion.div>
      </div>
      
      {/* Quick Links */}
      <div className="px-6 pb-8 bg-white">
        <div className="grid grid-cols-2 gap-4">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link key={link.id} to={link.path}>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`bg-gradient-to-br ${link.color} p-6 relative overflow-hidden group hover:shadow-lg transition-shadow`}
                >
                  <Icon className="w-8 h-8 text-white/90 mb-3" />
                  <p className="text-base text-white font-medium">{link.name}</p>
                  <div className="absolute -right-4 -bottom-4 w-16 h-16 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-300" />
                </motion.div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Products */}
      <div className="px-6 bg-[#FAFAF8]">
        <div className="flex items-baseline justify-between mb-6 pb-4">
          <h2 className="text-base text-[#2C2C2C] tracking-wide">热门推荐</h2>
          <span className="text-[10px] text-[#8B8680] tracking-[0.2em] uppercase">Featured</span>
        </div>
        <div className="grid grid-cols-2 gap-4 pb-6">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link to={`/product/${product.id}`}>
                <div className="bg-white overflow-hidden border border-[#E5E3DF] group hover:border-[#4A3428] transition-colors">
                  <div className="aspect-square overflow-hidden bg-[#F5F5F3]">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm text-[#2C2C2C] mb-2">{product.name}</h3>
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs text-[#8B8680]">¥</span>
                      <span className="text-base text-[#4A3428]">{product.price}</span>
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
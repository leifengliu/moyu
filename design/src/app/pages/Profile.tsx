import { QrCode, ChevronRight, Receipt, Wallet, Award, Gift, Headphones } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';

export default function Profile() {
  const stats = [
    { label: '订单', value: '5', path: '/orders' },
    { label: '储值', value: '¥128', path: '/wallet' },
    { label: '积分', value: '360', path: '/points' },
    { label: '优惠券', value: '3', path: '/coupons' },
  ];
  
  const menuItems = [
    { icon: Receipt, label: '我的订单', path: '/orders' },
    { icon: Wallet, label: '储值中心', path: '/wallet' },
    { icon: Award, label: '积分商城', path: '/points' },
    { icon: Gift, label: '会员福利', path: '/benefits' },
    { icon: Headphones, label: '客服中心', path: '/support' },
  ];
  
  return (
    <div className="min-h-screen bg-[#F8F6F3] pb-20">
      {/* Header */}
      <div className="bg-[#1A1614] pt-11 pb-12 px-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#C9A961] rounded-full flex items-center justify-center">
              <span className="text-[#1A1614] text-xl font-medium">摸</span>
            </div>
            <div>
              <h2 className="text-lg text-white mb-1">摸鱼用户</h2>
              <p className="text-sm text-white/60">已摸鱼 30 天</p>
            </div>
          </div>
          <button className="p-2">
            <QrCode className="w-6 h-6 text-[#C9A961]" />
          </button>
        </div>
        
        <motion.button 
          whileTap={{ scale: 0.98 }}
          className="w-full bg-white/10 backdrop-blur-sm border border-white/20 text-white rounded-lg py-3 px-6 text-sm"
        >
          每日签到 +10 积分
        </motion.button>
      </div>
      
      {/* Stats */}
      <div className="bg-white mx-6 -mt-6 rounded-lg border border-[#E8DED3] p-6 mb-6 shadow-sm">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link 
              key={stat.label} 
              to={stat.path}
              className="flex flex-col items-center"
            >
              <p className="text-lg text-[#1A1A1A] mb-1 font-medium">{stat.value}</p>
              <p className="text-xs text-[#8B8680]">{stat.label}</p>
            </Link>
          ))}
        </div>
      </div>
      
      {/* Menu */}
      <div className="bg-white mx-6 rounded-lg border border-[#E8DED3] overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center justify-between px-6 py-4 ${
                index < menuItems.length - 1 ? 'border-b border-[#E8DED3]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-[#C9A961]" />
                <span className="text-sm text-[#1A1A1A]">{item.label}</span>
              </div>
              <ChevronRight className="w-5 h-5 text-[#CCCCCC]" />
            </Link>
          );
        })}
      </div>
      
      <BottomNav />
    </div>
  );
}

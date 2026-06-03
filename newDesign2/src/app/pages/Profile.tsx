import { QrCode, ChevronRight, Receipt, Wallet, Award, Gift, Headphones, Crown, User } from 'lucide-react';
import { Link } from 'react-router';
import { BottomNav } from '../components/BottomNav';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function Profile() {
  const [isMember, setIsMember] = useState(false); // 模拟会员状态

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
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="bg-white pt-11 pb-6 px-6">
        <div className="flex items-center justify-between mb-6">
          <Link to="/user-info" className="flex items-center gap-4">
            <div className="w-16 h-16 bg-[#4A3428] flex items-center justify-center">
              <span className="text-white text-xl">摸</span>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-base text-[#2C2C2C]">摸鱼用户</h2>
                {isMember && (
                  <div className="flex items-center gap-1 bg-gradient-to-r from-[#C9A67A] to-[#D4B896] px-2 py-0.5">
                    <Crown className="w-3 h-3 text-white" />
                    <span className="text-[10px] text-white tracking-wide">VIP</span>
                  </div>
                )}
              </div>
              <p className="text-xs text-[#8B8680]">已摸鱼 30 天</p>
            </div>
          </Link>
          <div className="flex items-center gap-3">
            <button className="p-2">
              <QrCode className="w-5 h-5 text-[#2C2C2C]" />
            </button>
            {/* 预留胶囊空间 */}
            <div className="w-[87px]" />
          </div>
        </div>

        {isMember ? (
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="w-full bg-[#F5F5F3] border border-[#E5E3DF] text-[#2C2C2C] py-3 text-sm"
          >
            每日签到 +10 积分
          </motion.button>
        ) : (
          <Link to="/membership">
            <motion.button
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-[#4A3428] to-[#6B4F3E] text-white py-3 text-sm relative overflow-hidden"
            >
              <div className="flex items-center justify-center gap-2">
                <Crown className="w-4 h-4" />
                <span>开通会员享专属优惠</span>
              </div>
            </motion.button>
          </Link>
        )}
      </div>

      {/* Stats */}
      <div className="bg-white mx-6 mt-3 border border-[#E5E3DF] p-6 mb-3">
        <div className="grid grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link
              key={stat.label}
              to={stat.path}
              className="flex flex-col items-center"
            >
              <p className="text-base text-[#2C2C2C] mb-1.5 font-medium">{stat.value}</p>
              <p className="text-[10px] text-[#8B8680]">{stat.label}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white mx-6 border border-[#E5E3DF] overflow-hidden">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.label}
              to={item.path}
              className={`flex items-center justify-between px-6 py-4 ${
                index < menuItems.length - 1 ? 'border-b border-[#E5E3DF]' : ''
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className="w-5 h-5 text-[#4A3428]" />
                <span className="text-sm text-[#2C2C2C]">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-[#A09C97]" />
            </Link>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
}

import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export default function Wallet() {
  const navigate = useNavigate();
  
  const packages = [
    { id: 1, amount: 100, bonus: 10, desc: '赠送10元' },
    { id: 2, amount: 200, bonus: 30, desc: '赠送30元', popular: true },
    { id: 3, amount: 500, bonus: 100, desc: '赠送100元' },
    { id: 4, amount: 1000, bonus: 300, desc: '赠送300元' },
  ];
  
  const records = [
    { id: 1, type: '消费', amount: -28, desc: '拿铁咖啡', date: '2026-03-25 14:30' },
    { id: 2, type: '充值', amount: 200, desc: '储值套餐', date: '2026-03-24 10:15' },
    { id: 3, type: '消费', amount: -52, desc: '卡布奇诺x2', date: '2026-03-23 16:45' },
  ];
  
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FFE4E1]">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#333333]" />
          </button>
          <h1 className="text-lg text-[#333333]">储值中心</h1>
        </div>
      </div>
      
      {/* Balance */}
      <div className="bg-gradient-to-br from-[#FF9B85] to-[#FFA07A] mx-6 mt-6 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-2">储值余额（元）</p>
        <p className="text-4xl mb-6">128.00</p>
        <button className="w-full bg-white/20 backdrop-blur-sm rounded-full py-3 text-sm">
          立即充值
        </button>
      </div>
      
      {/* Packages */}
      <div className="px-6 py-6">
        <h2 className="text-base text-[#333333] mb-4">储值套餐</h2>
        <div className="grid grid-cols-2 gap-4">
          {packages.map((pkg, index) => (
            <motion.button
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-white rounded-2xl p-6 border-2 ${
                pkg.popular ? 'border-[#FF9B85]' : 'border-[#FFE4E1]'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-gradient-to-r from-[#FF9B85] to-[#FFA07A] text-white text-xs px-3 py-1 rounded-full">
                  推荐
                </span>
              )}
              <div className="text-center">
                <p className="text-2xl text-[#333333] mb-1">¥{pkg.amount}</p>
                <p className="text-xs text-[#FF9B85]">{pkg.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Records */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-[#333333]">储值明细</h2>
          <button className="flex items-center gap-1 text-sm text-[#999999]">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-white rounded-2xl overflow-hidden border border-[#FFE4E1]">
          {records.map((record, index) => (
            <div
              key={record.id}
              className={`px-6 py-4 ${
                index < records.length - 1 ? 'border-b border-[#FFE4E1]' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm text-[#333333]">{record.desc}</span>
                <span className={`text-base ${
                  record.amount > 0 ? 'text-[#FF9B85]' : 'text-[#333333]'
                }`}>
                  {record.amount > 0 ? '+' : ''}{record.amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-[#999999]">{record.date}</span>
                <span className="text-xs text-[#999999]">{record.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
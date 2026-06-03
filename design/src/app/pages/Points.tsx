import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';

export default function Points() {
  const navigate = useNavigate();
  
  const products = [
    { 
      id: 1, 
      name: '拿铁券', 
      points: 200, 
      image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NDU1MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 50,
    },
    { 
      id: 2, 
      name: '美式券', 
      points: 150, 
      image: 'https://images.unsplash.com/photo-1634568574054-0ab278fdc1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cCUyMG1pbml0YWxpc3R8ZW58MXx8fHwxNzc0NDQwMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 80,
    },
    { 
      id: 3, 
      name: '可颂券', 
      points: 100, 
      image: 'https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc0Mzg2NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 100,
    },
    { 
      id: 4, 
      name: '咖啡豆', 
      points: 500, 
      image: 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzc0NDU1MTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 20,
    },
  ];
  
  const records = [
    { id: 1, type: '签到', points: 10, date: '2026-03-25' },
    { id: 2, type: '消费', points: 28, date: '2026-03-25' },
    { id: 3, type: '兑换', points: -200, date: '2026-03-24' },
  ];
  
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#FFE4E1]">
        <div className="px-6 py-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-6 h-6 text-[#333333]" />
          </button>
          <h1 className="text-lg text-[#333333]">积分商城</h1>
        </div>
      </div>
      
      {/* Points Balance */}
      <div className="bg-gradient-to-br from-[#FF9B85] to-[#FFA07A] mx-6 mt-6 rounded-3xl p-8 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-2">我的积分</p>
        <p className="text-4xl mb-2">360</p>
        <button className="flex items-center gap-1 text-sm opacity-90">
          积分明细
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
      
      {/* Products */}
      <div className="px-6 py-6">
        <h2 className="text-base text-[#333333] mb-4">积分兑换</h2>
        <div className="grid grid-cols-2 gap-4">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl overflow-hidden border border-[#FFE4E1]"
            >
              <div className="aspect-square overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="text-sm text-[#333333] mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-lg text-[#FF9B85]">{product.points} 积分</span>
                  <span className="text-xs text-[#999999]">剩余 {product.stock}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 rounded-full bg-gradient-to-r from-[#FF9B85] to-[#FFA07A] text-white text-sm shadow-md"
                >
                  立即兑换
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
      
      {/* Records */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-base text-[#333333]">积分明细</h2>
          <button className="flex items-center gap-1 text-sm text-[#999999]">
            查看全部
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="bg-white rounded-2xl overflow-hidden border border-[#FFE4E1]">
          {records.map((record, index) => (
            <div
              key={record.id}
              className={`px-6 py-4 flex items-center justify-between ${
                index < records.length - 1 ? 'border-b border-[#FFE4E1]' : ''
              }`}
            >
              <div>
                <p className="text-sm text-[#333333] mb-1">{record.type}</p>
                <p className="text-xs text-[#999999]">{record.date}</p>
              </div>
              <span className={`text-base ${
                record.points > 0 ? 'text-[#FF9B85]' : 'text-[#333333]'
              }`}>
                {record.points > 0 ? '+' : ''}{record.points}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
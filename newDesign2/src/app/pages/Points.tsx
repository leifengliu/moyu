import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BottomNav } from '../components/BottomNav';

export default function Points() {
  const navigate = useNavigate();

  const products = [
    {
      id: 1,
      name: 'Latte Voucher',
      points: 200,
      image: 'https://images.unsplash.com/photo-1622240644058-86d737f0b3ce?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBsYXR0ZSUyMGFydCUyMG1pbmltYWx8ZW58MXx8fHwxNzc0NDU1MTQ5fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 50,
    },
    {
      id: 2,
      name: 'Americano Voucher',
      points: 150,
      image: 'https://images.unsplash.com/photo-1634568574054-0ab278fdc1e9?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxlc3ByZXNzbyUyMGNvZmZlZSUyMGN1cCUyMG1pbml0YWxpc3R8ZW58MXx8fHwxNzc0NDQwMDQ2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 80,
    },
    {
      id: 3,
      name: 'Croissant Voucher',
      points: 100,
      image: 'https://images.unsplash.com/photo-1751151856149-5ebf1d21586a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjcm9pc3NhbnQlMjBwYXN0cnklMjBiYWtlcnl8ZW58MXx8fHwxNzc0Mzg2NTAyfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 100,
    },
    {
      id: 4,
      name: 'Coffee Beans',
      points: 500,
      image: 'https://images.unsplash.com/photo-1672570050756-4f1953bde478?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2ZmZWUlMjBiZWFucyUyMHJvYXN0ZWR8ZW58MXx8fHwxNzc0NDU1MTUxfDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral',
      stock: 20,
    },
  ];

  const records = [
    { id: 1, type: 'Check-in', points: 10, date: '2026-03-25' },
    { id: 2, type: 'Purchase', points: 28, date: '2026-03-25' },
    { id: 3, type: 'Redeem', points: -200, date: '2026-03-24' },
  ];

  return (
    <div className="min-h-screen bg-black pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black border-b border-white/10">
        <div className="h-11" />
        <div className="px-6 pb-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-sm text-white tracking-wide uppercase">Points</h1>
        </div>
      </div>

      {/* Points Balance */}
      <div className="bg-white mx-6 mt-6 p-8 border border-black">
        <p className="text-[10px] text-black/40 mb-3 tracking-[0.2em] uppercase">My Points</p>
        <p className="text-5xl text-black mb-3 tracking-tight">360</p>
        <button className="flex items-center gap-1 text-xs text-black/40 tracking-wide uppercase">
          View History
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Products */}
      <div className="px-6 py-8">
        <h2 className="text-[10px] text-white/40 mb-4 tracking-[0.2em] uppercase">Redeem</h2>
        <div className="grid grid-cols-2 gap-3">
          {products.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white overflow-hidden border border-black"
            >
              <div className="aspect-square overflow-hidden">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover grayscale"
                />
              </div>
              <div className="p-4 border-t border-black">
                <h3 className="text-xs text-black mb-2">{product.name}</h3>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-black">{product.points} pts</span>
                  <span className="text-[10px] text-black/40">×{product.stock}</span>
                </div>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  className="w-full py-2 bg-black text-white text-[10px] tracking-wide uppercase"
                >
                  Redeem
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Records */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[10px] text-white/40 tracking-[0.2em] uppercase">History</h2>
          <button className="flex items-center gap-1 text-xs text-white/40 tracking-wide uppercase">
            View All
            <ChevronRight className="w-3 h-3" />
          </button>
        </div>

        <div className="bg-white border border-black overflow-hidden">
          {records.map((record, index) => (
            <div
              key={record.id}
              className={`px-5 py-4 flex items-center justify-between ${
                index < records.length - 1 ? 'border-b border-black/10' : ''
              }`}
            >
              <div>
                <p className="text-xs text-black mb-1">{record.type}</p>
                <p className="text-[10px] text-black/40">{record.date}</p>
              </div>
              <span className={`text-sm ${
                record.points > 0 ? 'text-black' : 'text-black'
              }`}>
                {record.points > 0 ? '+' : ''}{record.points}
              </span>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
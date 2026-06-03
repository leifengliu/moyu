import { ArrowLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BottomNav } from '../components/BottomNav';

export default function Wallet() {
  const navigate = useNavigate();

  const packages = [
    { id: 1, amount: 100, bonus: 10, desc: '+¥10 Bonus' },
    { id: 2, amount: 200, bonus: 30, desc: '+¥30 Bonus', popular: true },
    { id: 3, amount: 500, bonus: 100, desc: '+¥100 Bonus' },
    { id: 4, amount: 1000, bonus: 300, desc: '+¥300 Bonus' },
  ];

  const records = [
    { id: 1, type: 'Purchase', amount: -28, desc: 'Latte', date: '2026-03-25 14:30' },
    { id: 2, type: 'Top-up', amount: 200, desc: 'Wallet Package', date: '2026-03-24 10:15' },
    { id: 3, type: 'Purchase', amount: -52, desc: 'Cappuccino ×2', date: '2026-03-23 16:45' },
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
          <h1 className="text-sm text-white tracking-wide uppercase">Wallet</h1>
        </div>
      </div>

      {/* Balance */}
      <div className="bg-white mx-6 mt-6 p-8 border border-black">
        <p className="text-[10px] text-black/40 mb-3 tracking-[0.2em] uppercase">Balance</p>
        <p className="text-5xl text-black mb-6 tracking-tight">¥128</p>
        <button className="w-full bg-black text-white py-3 text-xs tracking-wide uppercase border border-black">
          Top Up Now
        </button>
      </div>

      {/* Packages */}
      <div className="px-6 py-8">
        <h2 className="text-[10px] text-white/40 mb-4 tracking-[0.2em] uppercase">Packages</h2>
        <div className="grid grid-cols-2 gap-3">
          {packages.map((pkg, index) => (
            <motion.button
              key={pkg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.98 }}
              className={`relative bg-white p-6 border ${
                pkg.popular ? 'border-black' : 'border-black'
              }`}
            >
              {pkg.popular && (
                <span className="absolute -top-2 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] px-3 py-1 tracking-wide uppercase">
                  Popular
                </span>
              )}
              <div className="text-center">
                <p className="text-2xl text-black mb-1.5">¥{pkg.amount}</p>
                <p className="text-xs text-black/40">{pkg.desc}</p>
              </div>
            </motion.button>
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
              className={`px-5 py-4 ${
                index < records.length - 1 ? 'border-b border-black/10' : ''
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-black">{record.desc}</span>
                <span className={`text-sm ${
                  record.amount > 0 ? 'text-black' : 'text-black'
                }`}>
                  {record.amount > 0 ? '+' : ''}{record.amount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] text-black/40">{record.date}</span>
                <span className="text-[10px] text-black/40 uppercase">{record.type}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <BottomNav />
    </div>
  );
}
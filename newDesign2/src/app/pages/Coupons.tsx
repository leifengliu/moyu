import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export default function Coupons() {
  const navigate = useNavigate();

  const coupons = [
    {
      id: 1,
      title: '新用户专享',
      discount: '¥10',
      condition: '满30可用',
      expiry: '2026.06.30',
      used: false,
    },
    {
      id: 2,
      title: '咖啡优惠券',
      discount: '¥5',
      condition: '无门槛',
      expiry: '2026.06.15',
      used: false,
    },
    {
      id: 3,
      title: '生日礼券',
      discount: '¥20',
      condition: '满50可用',
      expiry: '2026.07.01',
      used: true,
    },
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
          <h1 className="text-sm text-white tracking-wide uppercase">Coupons</h1>
        </div>
      </div>

      {/* Coupons List */}
      <div className="px-6 py-6 space-y-3">
        {coupons.map((coupon) => (
          <div
            key={coupon.id}
            className={`bg-white p-6 border border-black ${
              coupon.used ? 'opacity-40' : ''
            }`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="text-sm text-black mb-1 tracking-wide">
                  {coupon.title}
                </h3>
                <p className="text-xs text-black/40">{coupon.condition}</p>
              </div>
              <div className="text-right">
                <p className="text-2xl text-black">{coupon.discount}</p>
              </div>
            </div>
            <div className="flex items-center justify-between border-t border-black/10 pt-3">
              <p className="text-[10px] text-black/40 tracking-wide uppercase">
                Expires {coupon.expiry}
              </p>
              {!coupon.used && (
                <button className="px-4 py-1.5 bg-black text-white text-[10px] tracking-wide uppercase">
                  Use
                </button>
              )}
              {coupon.used && (
                <span className="text-[10px] text-black/40 tracking-wide uppercase">
                  Used
                </span>
              )}
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

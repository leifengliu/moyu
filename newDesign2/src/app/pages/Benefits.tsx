import { ArrowLeft, Gift } from 'lucide-react';
import { useNavigate } from 'react-router';
import { BottomNav } from '../components/BottomNav';

export default function Benefits() {
  const navigate = useNavigate();

  const benefits = [
    {
      id: 1,
      title: 'Birthday Gift',
      desc: 'Free drink on your birthday',
      icon: '🎂',
    },
    {
      id: 2,
      title: 'Daily Check-in',
      desc: 'Earn 10 points every day',
      icon: '✓',
    },
    {
      id: 3,
      title: 'Referral Bonus',
      desc: '¥20 for each friend referred',
      icon: '👥',
    },
    {
      id: 4,
      title: 'Member Discount',
      desc: '10% off on all purchases',
      icon: '💰',
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
          <h1 className="text-sm text-white tracking-wide uppercase">Member Benefits</h1>
        </div>
      </div>

      {/* Benefits List */}
      <div className="px-6 py-6 space-y-3">
        {benefits.map((benefit) => (
          <div key={benefit.id} className="bg-white p-6 border border-black">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-black flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">{benefit.icon}</span>
              </div>
              <div className="flex-1">
                <h3 className="text-sm text-black mb-1.5 tracking-wide">
                  {benefit.title}
                </h3>
                <p className="text-xs text-black/40 leading-relaxed">
                  {benefit.desc}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}

import { ArrowLeft, Check } from 'lucide-react';
import { useNavigate } from 'react-router';
import { motion } from 'motion/react';
import { BottomNav } from '../components/BottomNav';

export default function Membership() {
  const navigate = useNavigate();

  const benefits = [
    '所有饮品享受会员价',
    '每月赠送 2 张优惠券',
    '生日当天免费饮品',
    '积分双倍累积',
    '优先参与新品试饮',
    '专属会员活动',
  ];

  const plans = [
    {
      id: 'monthly',
      name: '月度会员',
      price: 29,
      period: '月',
      desc: '灵活订阅，随时取消',
    },
    {
      id: 'quarterly',
      name: '季度会员',
      price: 79,
      period: '季',
      desc: '平均每月 ¥26',
      discount: '节省 ¥8',
      popular: true,
    },
    {
      id: 'yearly',
      name: '年度会员',
      price: 288,
      period: '年',
      desc: '平均每月 ¥24',
      discount: '节省 ¥60',
    },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E3DF]">
        <div className="h-11" />
        <div className="px-6 pb-4 flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
          </button>
          <h1 className="text-base tracking-[0.15em] text-[#2C2C2C]">开通会员</h1>
          {/* 预留胶囊按钮空间 */}
          <div className="ml-auto w-[103px]" />
        </div>
      </div>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#4A3428] to-[#6B4F3E] px-6 py-12">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-3 tracking-tight">MOYU 会员</h2>
          <p className="text-sm text-white/80">享受专属优惠，每天一杯好咖啡</p>
        </div>
      </div>

      {/* Benefits */}
      <div className="px-6 py-8">
        <h3 className="text-sm text-[#2C2C2C] mb-4 font-medium">会员权益</h3>
        <div className="bg-white border border-[#E5E3DF] p-6 space-y-4">
          {benefits.map((benefit, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3"
            >
              <div className="w-5 h-5 bg-[#4A3428] flex items-center justify-center flex-shrink-0">
                <Check className="w-3 h-3 text-white" />
              </div>
              <span className="text-sm text-[#2C2C2C]">{benefit}</span>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Plans */}
      <div className="px-6 pb-8">
        <h3 className="text-sm text-[#2C2C2C] mb-4 font-medium">选择套餐</h3>
        <div className="space-y-3">
          {plans.map((plan, index) => (
            <motion.button
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.98 }}
              className={`w-full relative bg-white border-2 p-5 transition-all ${
                plan.popular
                  ? 'border-[#4A3428]'
                  : 'border-[#E5E3DF] hover:border-[#C9A67A]'
              }`}
            >
              {plan.popular && (
                <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-[#4A3428] text-white text-xs px-4 py-1 tracking-wide">
                  推荐
                </span>
              )}
              <div className="flex items-center justify-between">
                <div className="text-left">
                  <h4 className="text-base text-[#2C2C2C] mb-1">{plan.name}</h4>
                  <p className="text-xs text-[#8B8680]">{plan.desc}</p>
                  {plan.discount && (
                    <p className="text-xs text-[#C9A67A] mt-1">{plan.discount}</p>
                  )}
                </div>
                <div className="text-right">
                  <div className="flex items-baseline gap-0.5">
                    <span className="text-xs text-[#8B8680]">¥</span>
                    <span className="text-2xl text-[#4A3428] font-medium">{plan.price}</span>
                  </div>
                  <p className="text-xs text-[#8B8680] mt-1">/ {plan.period}</p>
                </div>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div className="px-6 pb-6">
        <motion.button
          whileTap={{ scale: 0.98 }}
          className="w-full bg-[#4A3428] text-white py-4 text-sm tracking-wide"
        >
          立即开通
        </motion.button>
        <p className="text-xs text-[#A09C97] text-center mt-4">
          开通即视为同意《会员服务协议》
        </p>
      </div>

      <BottomNav />
    </div>
  );
}

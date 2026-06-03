import { ArrowLeft, Clock, CheckCircle, Package, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate, useParams, useLocation } from 'react-router';
import { motion } from 'motion/react';
import { useState } from 'react';

export default function OrderDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  
  const orderData = location.state || {
    items: [
      {
        id: 1,
        name: '拿铁咖啡',
        price: 28,
        quantity: 1,
        size: '中杯',
        temp: '热饮',
        sugar: '标准糖',
      },
    ],
    total: 28,
    status: 'completed',
  };

  const [status, setStatus] = useState(orderData.status);
  
  const statusConfig = {
    pending: { 
      text: '待付款', 
      color: 'text-[#C9A961]', 
      bg: 'bg-[#F8F6F3]',
      icon: Clock,
      action: '立即支付'
    },
    paid: { 
      text: '待制作', 
      color: 'text-[#C9A961]', 
      bg: 'bg-[#F8F6F3]',
      icon: Package,
      action: null
    },
    preparing: { 
      text: '制作中', 
      color: 'text-[#C9A961]', 
      bg: 'bg-[#F8F6F3]',
      icon: Package,
      action: null
    },
    ready: { 
      text: '待取餐', 
      color: 'text-[#C9A961]', 
      bg: 'bg-[#F8F6F3]',
      icon: CheckCircle,
      action: '查看取餐码'
    },
    completed: { 
      text: '已完成', 
      color: 'text-[#1A1A1A]', 
      bg: 'bg-[#E8DED3]',
      icon: CheckCircle,
      action: null
    },
  };

  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
  const StatusIcon = currentStatus.icon;

  const handlePay = () => {
    setStatus('paid');
    setTimeout(() => setStatus('preparing'), 1000);
    setTimeout(() => setStatus('ready'), 3000);
  };

  const timeline = [
    { label: '订单创建', time: '14:30', active: true },
    { label: '支付成功', time: status !== 'pending' ? '14:31' : '', active: status !== 'pending' },
    { label: '开始制作', time: status === 'preparing' || status === 'ready' || status === 'completed' ? '14:32' : '', active: status === 'preparing' || status === 'ready' || status === 'completed' },
    { label: '制作完成', time: status === 'ready' || status === 'completed' ? '14:40' : '', active: status === 'ready' || status === 'completed' },
    { label: '已取餐', time: status === 'completed' ? '14:45' : '', active: status === 'completed' },
  ];

  return (
    <div className="min-h-screen bg-[#FAFAF8] pb-32">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b border-[#E5E3DF]">
        <div className="h-11" />
        <div className="px-6 pb-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="p-2 -ml-2">
            <ArrowLeft className="w-5 h-5 text-[#2C2C2C]" />
          </button>
          {/* 预留胶囊空间 */}
          <div className="w-[103px]" />
        </div>
      </div>

      {/* Status Card */}
      <div className="px-6 py-6">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`${currentStatus.bg} rounded-lg p-8 border border-[#E8DED3]`}
        >
          <div className="flex items-center gap-4 mb-6">
            <div className={`w-12 h-12 ${currentStatus.bg} rounded-full flex items-center justify-center border-2 border-white`}>
              <StatusIcon className={`w-6 h-6 ${currentStatus.color}`} />
            </div>
            <div>
              <p className={`text-xl ${currentStatus.color}`} style={{ fontFamily: 'serif' }}>{currentStatus.text}</p>
              {status === 'ready' && (
                <p className="text-sm text-[#8B8680] mt-1">请在30分钟内取餐</p>
              )}
            </div>
          </div>
          
          {status === 'ready' && (
            <div className="bg-white rounded-lg p-6 flex items-center justify-center border border-[#E8DED3]">
              <div className="text-center">
                <div className="text-5xl mb-3 text-[#1A1A1A] font-medium" style={{ fontFamily: 'serif' }}>8888</div>
                <p className="text-xs text-[#8B8680] tracking-widest">取餐码 PICKUP CODE</p>
              </div>
            </div>
          )}
        </motion.div>
      </div>

      {/* Store Info */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg p-6 border border-[#E8DED3]">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-[#4A3428] flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-base text-[#1A1A1A] mb-2">摸鱼咖啡（万象城店）</h3>
              <p className="text-sm text-[#8B8680] mb-4">深圳市南山区深南大道9668号</p>
              <div className="flex gap-3">
                <button className="flex-1 py-2 rounded-lg border border-[#E8DED3] text-sm text-[#8B8680]">
                  电话
                </button>
                <button className="flex-1 py-2 rounded-lg border border-[#E8DED3] text-sm text-[#8B8680]">
                  导航
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg p-6 border border-[#E8DED3]">
          <h3 className="text-base text-[#1A1A1A] mb-5" style={{ fontFamily: 'serif' }}>订单商品</h3>
          <div className="space-y-4">
            {orderData.items.map((item: any) => (
              <div key={item.id} className="flex justify-between">
                <div className="flex-1">
                  <p className="text-sm text-[#1A1A1A] mb-1">{item.name}</p>
                  <p className="text-xs text-[#8B8680]">
                    {item.size} / {item.temp} / {item.sugar}
                  </p>
                </div>
                <div className="text-right ml-4">
                  <p className="text-sm text-[#8B8680] mb-1">×{item.quantity}</p>
                  <p className="text-sm text-[#C9A961]">¥{item.price}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-[#E8DED3] mt-5 pt-5 flex items-center justify-between">
            <span className="text-sm text-[#8B8680]">合计</span>
            <div className="flex items-baseline gap-1">
              <span className="text-sm text-[#8B8680]">¥</span>
              <span className="text-2xl text-[#C9A961]">{orderData.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg p-6 border border-[#E8DED3]">
          <h3 className="text-base text-[#1A1A1A] mb-5" style={{ fontFamily: 'serif' }}>订单进度</h3>
          <div className="space-y-4">
            {timeline.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full ${
                      step.active ? 'bg-[#C9A961]' : 'bg-[#E8DED3]'
                    }`}
                  />
                  {index < timeline.length - 1 && (
                    <div
                      className={`w-0.5 h-10 ${
                        step.active ? 'bg-[#C9A961]' : 'bg-[#E8DED3]'
                      }`}
                    />
                  )}
                </div>
                <div className="flex-1 -mt-1">
                  <p
                    className={`text-sm ${
                      step.active ? 'text-[#1A1A1A]' : 'text-[#8B8680]'
                    }`}
                  >
                    {step.label}
                  </p>
                  {step.time && (
                    <p className="text-xs text-[#8B8680] mt-1">{step.time}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Order Info */}
      <div className="px-6 pb-6">
        <div className="bg-white rounded-lg p-6 border border-[#E8DED3]">
          <h3 className="text-base text-[#1A1A1A] mb-5" style={{ fontFamily: 'serif' }}>订单信息</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between">
              <span className="text-[#8B8680]">订单号</span>
              <span className="text-[#1A1A1A]">{id}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B8680]">下单时间</span>
              <span className="text-[#1A1A1A]">2026-03-25 14:30</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8B8680]">支付方式</span>
              <span className="text-[#1A1A1A]">{status === 'pending' ? '未支付' : '微信支付'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Action */}
      {currentStatus.action && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-[#E8DED3] px-6 py-5">
          <div className="max-w-md mx-auto flex gap-3">
            {status === 'pending' && (
              <button className="flex-1 py-4 rounded-lg border border-[#E8DED3] text-[#8B8680] text-base">
                取消订单
              </button>
            )}
            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={status === 'pending' ? handlePay : undefined}
              className="flex-1 bg-[#4A3428] text-white py-4 text-base"
            >
              {currentStatus.action}
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}
